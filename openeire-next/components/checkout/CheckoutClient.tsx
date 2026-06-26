"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutContactForm } from "@/components/checkout/CheckoutContactForm";
import { CheckoutDiscountCard } from "@/components/checkout/CheckoutDiscountCard";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutShippingForm } from "@/components/checkout/CheckoutShippingForm";
import { CheckoutTerms } from "@/components/checkout/CheckoutTerms";
import { StripePaymentSection } from "@/components/checkout/StripePaymentSection";
import { isApiError } from "@/lib/api/client";
import { getCheckoutCountries } from "@/lib/api/countries";
import {
  createPaymentIntent,
  validateDiscountCode,
} from "@/lib/api/checkout";
import {
  buildCheckoutCartPayload,
  buildCreatePaymentIntentPayload,
  getCheckoutCartSignature,
  hasCompleteContactDetails,
  hasCompleteShippingDetails,
  hasDigitalCartItems,
  hasPhysicalCartItems,
} from "@/lib/checkout/payload";
import {
  clearPendingDiscountCode,
  readPendingDiscountCode,
  savePendingDiscountCode,
} from "@/lib/discount/pendingDiscount";
import {
  buildAnalyticsItemFromCartItem,
  trackEcommerceEvent,
} from "@/lib/ecommerceAnalytics";
import {
  isStripeConfigured,
  STRIPE_CONFIGURATION_ERROR,
} from "@/lib/stripe/client";
import type { Country } from "@/types/auth";
import type {
  AppliedDiscount,
  CheckoutFormState,
  CheckoutReadiness,
  PaymentIntentQuote,
} from "@/types/checkout";

interface ActiveIntentRequest {
  id: number;
  signature: string;
  controller: AbortController;
}

interface CheckoutRequestIdentity {
  signature: string;
  id: string;
}

const createCheckoutId = (): string => {
  const browserCrypto = globalThis.crypto;
  if (typeof browserCrypto.randomUUID === "function") {
    return browserCrypto.randomUUID();
  }
  const bytes = browserCrypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
};

const paymentIntentIdFromClientSecret = (clientSecret: string): string => {
  const separatorIndex = clientSecret.indexOf("_secret_");
  return separatorIndex > 0 ? clientSecret.slice(0, separatorIndex) : "";
};

const EMPTY_FORM_STATE: CheckoutFormState = {
  contact: {
    name: "",
    email: "",
    phone: "",
  },
  shipping: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  },
  shippingMethod: "budget",
  saveInfo: true,
  acceptsTerms: false,
  acceptsPrivacy: false,
  acceptsPersonalUse: false,
};

const getSafeErrorText = (value: unknown, depth = 0): string | null => {
  if (typeof value === "string") {
    const normalized = value.trim();
    if (
      !normalized ||
      normalized.length > 300 ||
      /<[^>]+>/.test(normalized)
    ) {
      return null;
    }
    return normalized;
  }

  if (depth >= 3) return null;

  if (Array.isArray(value)) {
    for (const entry of value) {
      const message = getSafeErrorText(entry, depth + 1);
      if (message) return message;
    }
    return null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["detail", "message", "error"]) {
      const message = getSafeErrorText(record[key], depth + 1);
      if (message) return message;
    }
    for (const entry of Object.values(record)) {
      const message = getSafeErrorText(entry, depth + 1);
      if (message) return message;
    }
  }

  return null;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiError(error)) {
    if ((error.response?.status ?? 0) >= 500) return fallback;

    const responseMessage = getSafeErrorText(error.response?.data);
    if (responseMessage) return responseMessage;

    return getSafeErrorText(error.message) ?? fallback;
  }
  return fallback;
};

const getApiErrorCode = (error: unknown): string => {
  if (!isApiError(error) || !error.response?.data) return "";
  const data = error.response.data;
  if (typeof data !== "object") return "";
  const code = (data as Record<string, unknown>).code;
  return typeof code === "string" ? code : "";
};

const toNonNegativeNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const buildPaymentQuote = (response: {
  shippingCost?: number;
  discountAmount?: number;
  discountCode?: string;
  discountLabel?: string;
  totalPrice?: number;
  freeShippingApplied?: boolean;
  freeShippingThreshold?: number | string | null;
}): PaymentIntentQuote | null => {
  const totalPrice = toNonNegativeNumber(response.totalPrice);
  if (totalPrice === null) return null;

  return {
    shippingCost: toNonNegativeNumber(response.shippingCost) ?? 0,
    discountAmount: toNonNegativeNumber(response.discountAmount) ?? 0,
    discountCode: response.discountCode?.trim() || null,
    discountLabel: response.discountLabel?.trim() || null,
    totalPrice,
    freeShippingApplied: Boolean(response.freeShippingApplied),
    freeShippingThreshold: toNonNegativeNumber(
      response.freeShippingThreshold,
    ),
  };
};

export function CheckoutClient() {
  const router = useRouter();
  const { items, isLoaded: isCartLoaded } = useCart();
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const [formState, setFormState] =
    useState<CheckoutFormState>(EMPTY_FORM_STATE);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(
    null,
  );
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentQuote, setPaymentQuote] = useState<PaymentIntentQuote | null>(
    null,
  );
  const [intentSignature, setIntentSignature] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const prefilledProfileRef = useRef(false);
  const intentRequestSequenceRef = useRef(0);
  const discountRequestSequenceRef = useRef(0);
  const activeIntentRequestRef = useRef<ActiveIntentRequest | null>(null);
  const latestCheckoutSignatureRef = useRef("");
  const checkoutRequestIdentityRef = useRef<CheckoutRequestIdentity | null>(null);
  const autoApplyPendingDiscountRef = useRef<string | null>(null);

  const hasPhysicalItems = useMemo(() => hasPhysicalCartItems(items), [items]);
  const hasDigitalItems = useMemo(() => hasDigitalCartItems(items), [items]);
  const cartSignature = useMemo(() => getCheckoutCartSignature(items), [items]);
  const discountCustomerEmail = (
    formState.contact.email || user?.email || ""
  )
    .trim()
    .toLowerCase();
  const discountRequestSignature = JSON.stringify({
    cart: cartSignature,
    email: discountCustomerEmail,
    code: discountCode.trim().toUpperCase(),
  });
  const latestDiscountRequestSignatureRef = useRef(discountRequestSignature);
  latestDiscountRequestSignatureRef.current = discountRequestSignature;
  const requiresAuthenticatedCheckout = hasDigitalItems;
  const checkoutStateSignature = useMemo(
    () =>
      JSON.stringify({
        cart: cartSignature,
        contact: formState.contact,
        shipping: hasPhysicalItems ? formState.shipping : null,
        shippingMethod: hasPhysicalItems ? formState.shippingMethod : null,
        saveInfo: formState.saveInfo,
        acceptsTerms: formState.acceptsTerms,
        acceptsPrivacy: formState.acceptsPrivacy,
        acceptsPersonalUse: hasDigitalItems
          ? formState.acceptsPersonalUse
          : null,
        discountCode: appliedDiscount?.code ?? null,
        isAuthenticated,
      }),
    [
      appliedDiscount?.code,
      cartSignature,
      formState,
      hasDigitalItems,
      hasPhysicalItems,
      isAuthenticated,
    ],
  );
  latestCheckoutSignatureRef.current = checkoutStateSignature;

  const checkoutSuccessContext = useMemo(
    () => ({
      paymentIntentId: paymentIntentId ?? "",
      cartSignature,
      hasDigitalItems,
      hasPhysicalItems,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      analytics: paymentQuote
        ? {
            value: paymentQuote.totalPrice,
            shipping: paymentQuote.shippingCost,
            coupon: paymentQuote.discountCode ?? undefined,
            items: items.map(buildAnalyticsItemFromCartItem),
          }
        : undefined,
    }),
    [
      cartSignature,
      hasDigitalItems,
      hasPhysicalItems,
      items,
      paymentIntentId,
      paymentQuote,
    ],
  );

  useEffect(() => {
    if (isCartLoaded && items.length === 0) {
      router.replace("/bag");
    }
  }, [isCartLoaded, items.length, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    savePendingDiscountCode(params.get("discount"));

    const pendingDiscountCode = readPendingDiscountCode();
    if (!pendingDiscountCode) return;

    setDiscountCode(pendingDiscountCode);
    autoApplyPendingDiscountRef.current = pendingDiscountCode;
  }, []);

  useEffect(() => {
    if (!isCartLoaded || !user || prefilledProfileRef.current) return;
    prefilledProfileRef.current = true;

    setFormState((current) => ({
      ...current,
      contact: {
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        email: user.email ?? "",
        phone: user.default_phone_number ?? "",
      },
      shipping: {
        line1: user.default_street_address1 ?? "",
        line2: user.default_street_address2 ?? "",
        city: user.default_town ?? "",
        state: user.default_county ?? "",
        country:
          hasPhysicalItems && user.country !== "IE" && user.country !== "US"
            ? ""
            : (user.country ?? ""),
        postal_code: user.default_postcode ?? "",
      },
    }));
  }, [hasPhysicalItems, isCartLoaded, user]);

  useEffect(() => {
    if (!hasPhysicalItems) return;
    const controller = new AbortController();
    setIsLoadingCountries(true);
    setCountriesError(null);

    getCheckoutCountries(controller.signal)
      .then((payload) => {
        if (!controller.signal.aborted) setCountries(payload);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setCountriesError(
          getErrorMessage(
            error,
            "Could not load delivery countries. Please try again shortly.",
          ),
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingCountries(false);
      });

    return () => controller.abort();
  }, [hasPhysicalItems]);

  useEffect(() => {
    discountRequestSequenceRef.current += 1;
    setAppliedDiscount(null);
    setDiscountError(null);
    setIsApplyingDiscount(false);
  }, [cartSignature, discountCustomerEmail]);

  useEffect(() => {
    const activeRequest = activeIntentRequestRef.current;
    if (
      activeRequest &&
      activeRequest.signature !== checkoutStateSignature
    ) {
      intentRequestSequenceRef.current += 1;
      activeRequest.controller.abort();
      activeIntentRequestRef.current = null;
      setIsCreatingIntent(false);
      setPaymentError(
        "Your checkout details changed. Review them before preparing payment again.",
      );
    }

    if (intentSignature && intentSignature !== checkoutStateSignature) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setPaymentQuote(null);
      setIntentSignature(null);
      setPaymentError(
        "Your checkout details changed. Review them before preparing payment again.",
      );
    }
  }, [checkoutStateSignature, intentSignature]);

  useEffect(
    () => () => {
      activeIntentRequestRef.current?.controller.abort();
      activeIntentRequestRef.current = null;
    },
    [],
  );

  const readiness = useMemo<CheckoutReadiness>(() => {
    const errors: string[] = [];

    if (!items.length) errors.push("Your bag is empty.");
    if (requiresAuthenticatedCheckout && !isAuthenticated) {
      errors.push("Sign in to buy personal-use digital assets.");
    }
    if (!hasCompleteContactDetails(formState)) {
      errors.push("Enter your name, a valid email and phone number.");
    }
    if (hasPhysicalItems && !hasCompleteShippingDetails(formState)) {
      errors.push("Complete the required shipping details.");
    }
    if (!formState.acceptsTerms) {
      errors.push("Accept the Terms & Conditions.");
    }
    if (!formState.acceptsPrivacy) {
      errors.push("Confirm the privacy acknowledgement.");
    }
    if (hasDigitalItems && !formState.acceptsPersonalUse) {
      errors.push("Accept the personal-use licence terms.");
    }

    try {
      const payload = buildCreatePaymentIntentPayload({
        cartItems: items,
        formState,
        discountCode: appliedDiscount?.code,
        isAuthenticated,
      });
      return {
        isReady: errors.length === 0,
        errors,
        payload: errors.length === 0 ? payload : null,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "One or more bag items are invalid.";
      return {
        isReady: false,
        errors: [...errors, message],
        payload: null,
      };
    }
  }, [
    appliedDiscount?.code,
    formState,
    hasDigitalItems,
    hasPhysicalItems,
    isAuthenticated,
    items,
    requiresAuthenticatedCheckout,
  ]);

  const handleApplyDiscount = useCallback(async () => {
    const normalizedCode = discountCode.trim().toUpperCase();
    if (!normalizedCode) {
      setDiscountError("Enter a discount code.");
      return;
    }

    const email = formState.contact.email.trim();
    if (!email && !user?.email) {
      setDiscountError("Enter your email before applying a discount code.");
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError(null);
    const requestId = ++discountRequestSequenceRef.current;
    const requestSignature = discountRequestSignature;

    try {
      const response = await validateDiscountCode({
        cart: buildCheckoutCartPayload(items),
        email: email || user?.email || undefined,
        discount_code: normalizedCode,
      });

      if (
        requestId !== discountRequestSequenceRef.current ||
        requestSignature !== latestDiscountRequestSignatureRef.current
      ) {
        return;
      }

      setAppliedDiscount({
        code: response.code,
        amount: Number(response.discountAmount ?? 0),
        label: response.discountLabel ?? null,
        eligibleSubtotal: Number(response.eligibleSubtotal ?? 0),
      });
      setDiscountCode(response.code);
      clearPendingDiscountCode();
      autoApplyPendingDiscountRef.current = null;
    } catch (error) {
      if (
        requestId !== discountRequestSequenceRef.current ||
        requestSignature !== latestDiscountRequestSignatureRef.current
      ) {
        return;
      }
      setAppliedDiscount(null);
      if (autoApplyPendingDiscountRef.current === normalizedCode) {
        clearPendingDiscountCode();
      }
      autoApplyPendingDiscountRef.current = null;
      setDiscountError(
        getErrorMessage(
          error,
          "We could not apply that discount code right now.",
        ),
      );
    } finally {
      if (requestId === discountRequestSequenceRef.current) {
        setIsApplyingDiscount(false);
      }
    }
  }, [discountCode, discountRequestSignature, formState.contact.email, items, user?.email]);

  const handleRemoveDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError(null);
    clearPendingDiscountCode();
    autoApplyPendingDiscountRef.current = null;
  }, []);

  useEffect(() => {
    const pendingDiscountCode = autoApplyPendingDiscountRef.current;
    if (
      !pendingDiscountCode ||
      appliedDiscount ||
      isApplyingDiscount ||
      discountCode.trim().toUpperCase() !== pendingDiscountCode ||
      !items.length ||
      !discountCustomerEmail
    ) {
      return;
    }

    void handleApplyDiscount();
  }, [
    appliedDiscount,
    discountCode,
    discountCustomerEmail,
    handleApplyDiscount,
    isApplyingDiscount,
    items.length,
  ]);

  const handlePreparePayment = useCallback(async () => {
    if (isCreatingIntent || activeIntentRequestRef.current) return;

    if (!isStripeConfigured) {
      setPaymentError(STRIPE_CONFIGURATION_ERROR);
      return;
    }

    if (!readiness.isReady || !readiness.payload) {
      setPaymentError("Complete the required checkout details first.");
      return;
    }

    const requestId = ++intentRequestSequenceRef.current;
    const requestSignature = checkoutStateSignature;
    const controller = new AbortController();
    activeIntentRequestRef.current = {
      id: requestId,
      signature: requestSignature,
      controller,
    };

    setIsCreatingIntent(true);
    setPaymentError(null);
    setClientSecret(null);
    setPaymentIntentId(null);
    setPaymentQuote(null);
    setIntentSignature(null);

    try {
      let requestIdentity = checkoutRequestIdentityRef.current;
      if (!requestIdentity || requestIdentity.signature !== requestSignature) {
        requestIdentity = {
          signature: requestSignature,
          id: createCheckoutId(),
        };
        checkoutRequestIdentityRef.current = requestIdentity;
      }

      const response = await createPaymentIntent(
        {
          ...readiness.payload,
          checkout_id: requestIdentity.id,
        },
        controller.signal,
      );
      const currentRequest = activeIntentRequestRef.current;
      if (
        controller.signal.aborted ||
        !currentRequest ||
        currentRequest.id !== requestId ||
        latestCheckoutSignatureRef.current !== requestSignature
      ) {
        return;
      }

      const nextClientSecret = response.clientSecret?.trim();
      const nextPaymentIntentId =
        response.paymentIntentId?.trim() ||
        (nextClientSecret
          ? paymentIntentIdFromClientSecret(nextClientSecret)
          : "");
      const nextQuote = buildPaymentQuote(response);
      if (!nextClientSecret || !nextPaymentIntentId || !nextQuote) {
        throw new Error("INVALID_PAYMENT_INTENT_RESPONSE");
      }

      if (nextQuote.discountCode) {
        setAppliedDiscount({
          code: nextQuote.discountCode,
          amount: nextQuote.discountAmount,
          label: nextQuote.discountLabel,
          eligibleSubtotal: appliedDiscount?.eligibleSubtotal ?? null,
        });
        setDiscountCode(nextQuote.discountCode);
      }

      setPaymentQuote(nextQuote);
      setPaymentIntentId(nextPaymentIntentId);
      setIntentSignature(requestSignature);
      setClientSecret(nextClientSecret);
      trackEcommerceEvent("begin_checkout", {
        value: nextQuote.totalPrice,
        shipping: nextQuote.shippingCost,
        coupon: nextQuote.discountCode ?? undefined,
        items: items.map(buildAnalyticsItemFromCartItem),
      });
    } catch (error) {
      if (controller.signal.aborted) return;

      const message = getErrorMessage(
        error,
        "We could not prepare secure payment. Review your details and try again.",
      );
      if (getApiErrorCode(error).startsWith("DISCOUNT_")) {
        setAppliedDiscount(null);
        setDiscountCode("");
        setDiscountError(message);
      } else {
        setPaymentError(message);
      }
    } finally {
      if (activeIntentRequestRef.current?.id === requestId) {
        activeIntentRequestRef.current = null;
        setIsCreatingIntent(false);
      }
    }
  }, [
    appliedDiscount?.eligibleSubtotal,
    checkoutStateSignature,
    isCreatingIntent,
    items,
    readiness,
  ]);

  if (!isCartLoaded || isAuthLoading) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="sr-only">Preparing checkout</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <p className="text-sm text-gray-400">Redirecting to your bag...</p>
      </div>
    );
  }

  return (
    <div className="page-top-offset min-h-screen bg-black pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl pt-16 text-center md:pt-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <FaShieldAlt className="text-accent" aria-hidden="true" />
            <span className="text-sm text-gray-300">Secure Checkout</span>
          </div>
          <h1 className="mb-4 font-serif text-4xl font-bold text-white md:text-5xl">
            Finalise Your Order
          </h1>
          <p className="text-lg text-gray-400">
            {hasPhysicalItems
              ? "Enter your details and review your order before secure payment."
              : "Review your details before secure payment for your digital purchase."}
          </p>
        </div>

        {requiresAuthenticatedCheckout && !isAuthenticated ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-500/30 bg-brand-500/10 px-5 py-6 text-center text-sm text-gray-200">
            Digital purchases require an account so downloads can be attached to
            your order history.
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-white"
              >
                Log In to Continue
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
            <div className="space-y-8 lg:col-span-3">
              <CheckoutContactForm
                value={formState.contact}
                lockedEmail={isAuthenticated ? user?.email : null}
                onChange={(contact) =>
                  setFormState((current) => ({ ...current, contact }))
                }
              />

              {hasPhysicalItems ? (
                <CheckoutShippingForm
                  value={formState.shipping}
                  onChange={(shipping) =>
                    setFormState((current) => ({ ...current, shipping }))
                  }
                  shippingMethod={formState.shippingMethod}
                  onShippingMethodChange={(shippingMethod) =>
                    setFormState((current) => ({ ...current, shippingMethod }))
                  }
                  countries={countries}
                  isLoadingCountries={isLoadingCountries}
                  countriesError={countriesError}
                />
              ) : null}

              <CheckoutTerms
                value={formState}
                hasDigitalItems={hasDigitalItems}
                onChange={(terms) =>
                  setFormState((current) => ({ ...current, ...terms }))
                }
              />

              {readiness.errors.length ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-300">
                  <p>Required before payment:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-medium">
                    {readiness.errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {clientSecret && intentSignature ? (
                <StripePaymentSection
                  clientSecret={clientSecret}
                  formState={formState}
                  hasPhysicalItems={hasPhysicalItems}
                  isIntentCurrent={
                    intentSignature === checkoutStateSignature
                  }
                  isCheckoutBusy={isApplyingDiscount || isCreatingIntent}
                  successContext={checkoutSuccessContext}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8">
                  <button
                    type="button"
                    onClick={() => void handlePreparePayment()}
                    disabled={
                      !readiness.isReady ||
                      !readiness.payload ||
                      !isStripeConfigured ||
                      isApplyingDiscount ||
                      isCreatingIntent
                    }
                    className="w-full rounded-xl bg-brand-500 px-8 py-4 font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCreatingIntent
                      ? "Preparing secure payment..."
                      : "Continue to secure payment"}
                  </button>

                  {!isStripeConfigured ? (
                    <div
                      role="alert"
                      className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-300"
                    >
                      {STRIPE_CONFIGURATION_ERROR}
                    </div>
                  ) : null}

                  {paymentError ? (
                    <div
                      role="alert"
                      className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-300"
                    >
                      {paymentError}
                    </div>
                  ) : null}

                  <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
                    Totals and availability are revalidated securely by the
                    backend before Stripe payment options load.
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:col-span-2 lg:sticky lg:top-28">
              <CheckoutDiscountCard
                value={discountCode}
                onChange={(value) => {
                  setDiscountCode(value);
                  setDiscountError(null);
                }}
                onApply={handleApplyDiscount}
                onRemove={handleRemoveDiscount}
                appliedDiscount={appliedDiscount}
                errorMessage={discountError}
                isApplying={isApplyingDiscount}
                disabled={!items.length || isCreatingIntent}
              />
              <CheckoutOrderSummary
                items={items}
                appliedDiscount={appliedDiscount}
                paymentQuote={paymentQuote}
                hasPhysicalItems={hasPhysicalItems}
                hasDigitalItems={hasDigitalItems}
              />
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <FaLock aria-hidden="true" />
                Payment processing will remain Stripe-protected.
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
