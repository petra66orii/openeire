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
import { isApiError } from "@/lib/api/client";
import { getCheckoutCountries } from "@/lib/api/countries";
import { validateDiscountCode } from "@/lib/api/checkout";
import {
  buildCheckoutCartPayload,
  buildCreatePaymentIntentPayload,
  getCheckoutCartSignature,
  hasCompleteContactDetails,
  hasCompleteShippingDetails,
  hasDigitalCartItems,
  hasPhysicalCartItems,
} from "@/lib/checkout/payload";
import type { Country } from "@/types/auth";
import type {
  AppliedDiscount,
  CheckoutFormState,
  CheckoutReadiness,
} from "@/types/checkout";

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

const getSafeErrorText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (
    !normalized ||
    normalized.length > 300 ||
    /<[^>]+>/.test(normalized)
  ) {
    return null;
  }

  return normalized;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiError(error)) {
    if ((error.response?.status ?? 0) >= 500) return fallback;

    const data = error.response?.data;
    const stringMessage = getSafeErrorText(data);
    if (stringMessage) return stringMessage;

    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      for (const key of ["detail", "message", "error"]) {
        const message = getSafeErrorText(record[key]);
        if (message) return message;
      }

      for (const value of Object.values(record)) {
        const message = getSafeErrorText(
          Array.isArray(value) ? value[0] : value,
        );
        if (message) return message;
      }
    }

    return getSafeErrorText(error.message) ?? fallback;
  }
  return fallback;
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
  const prefilledProfileRef = useRef(false);

  const hasPhysicalItems = useMemo(() => hasPhysicalCartItems(items), [items]);
  const hasDigitalItems = useMemo(() => hasDigitalCartItems(items), [items]);
  const cartSignature = useMemo(() => getCheckoutCartSignature(items), [items]);
  const requiresAuthenticatedCheckout = hasDigitalItems;

  useEffect(() => {
    if (isCartLoaded && items.length === 0) {
      router.replace("/bag");
    }
  }, [isCartLoaded, items.length, router]);

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
    setAppliedDiscount(null);
    setDiscountError(null);
  }, [cartSignature]);

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

    try {
      const response = await validateDiscountCode({
        cart: buildCheckoutCartPayload(items),
        email: email || user?.email || undefined,
        discount_code: normalizedCode,
      });

      setAppliedDiscount({
        code: response.code,
        amount: Number(response.discountAmount ?? 0),
        label: response.discountLabel ?? null,
        eligibleSubtotal: Number(response.eligibleSubtotal ?? 0),
      });
      setDiscountCode(response.code);
    } catch (error) {
      setAppliedDiscount(null);
      setDiscountError(
        getErrorMessage(
          error,
          "We could not apply that discount code right now.",
        ),
      );
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [discountCode, formState.contact.email, items, user?.email]);

  const handleRemoveDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError(null);
  }, []);

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

              <div className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-brand-700/60 px-8 py-4 font-bold text-paper opacity-75"
                  title="Stripe payment integration follows in PR 22."
                >
                  Continue to secure payment
                </button>
                <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
                  PaymentIntent creation, Stripe PaymentElement and order
                  creation remain intentionally disabled until PR 22.
                </p>
                {readiness.isReady && readiness.payload ? (
                  <p className="mt-3 text-center text-xs text-brand-300">
                    Checkout details are ready for secure payment integration.
                  </p>
                ) : null}
              </div>
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
                disabled={!items.length}
              />
              <CheckoutOrderSummary
                items={items}
                appliedDiscount={appliedDiscount}
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
