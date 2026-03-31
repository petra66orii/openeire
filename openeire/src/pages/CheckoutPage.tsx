/// <reference types="vite/client" />

import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { isPhysicalCartOptions, useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProfile, UserProfile, api } from "../services/api";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { Link } from "react-router-dom";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import {
  cartHasDigitalItems,
  cartHasPhysicalItems,
  isDigitalProductType,
  isPhysicalProductType,
} from "../utils/purchaseFlow";
import { CheckoutSuccessContext } from "../utils/checkoutSuccessContext";
import { EMPTY_SHIPPING_DETAILS, ShippingDetails } from "../types/checkout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const flattenApiErrors = (value: unknown, path = ""): string[] => {
  if (typeof value === "string") {
    return [path ? `${path}: ${value}` : value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenApiErrors(entry, path));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nested]) =>
      flattenApiErrors(nested, path ? `${path}.${key}` : key),
    );
  }

  return [];
};

const hasCompletePhysicalAddress = (
  shippingDetails: ShippingDetails,
): boolean => {
  const requiredBaseFields = [
    shippingDetails.name,
    shippingDetails.email,
    shippingDetails.phone,
    shippingDetails.line1,
    shippingDetails.city,
    shippingDetails.country,
    shippingDetails.postal_code,
  ];

  const hasBase = requiredBaseFields.every(
    (field) => typeof field === "string" && field.trim().length > 0,
  );

  if (!hasBase) return false;
  if (shippingDetails.country === "US") {
    return (
      typeof shippingDetails.state === "string" &&
      shippingDetails.state.trim().length > 0
    );
  }

  return true;
};

const getApiErrorMessage = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return null;

  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.non_field_errors)) {
    const firstError = data.non_field_errors.find(
      (entry: unknown) => typeof entry === "string",
    );
    if (firstError) return firstError;
  }

  const flattened = flattenApiErrors(data);
  if (flattened.length > 0) {
    return flattened.slice(0, 3).join(" | ");
  }

  return null;
};

type CheckoutPhysicalOptionsPayload = {
  material?: string;
  size?: string;
  variantId: number;
};

type CheckoutCartItemPayload =
  | {
      product_id: number;
      product_type: "photo" | "video";
      quantity: number;
    }
  | {
      product_id: number;
      product_type: "physical";
      quantity: number;
      options: CheckoutPhysicalOptionsPayload;
    };

type CheckoutShippingAddressPayload = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

type CheckoutShippingDetailsPayload = {
  name: string;
  email: string;
  phone: string;
  address: CheckoutShippingAddressPayload;
};

type CreatePaymentIntentPayload = {
  cart: CheckoutCartItemPayload[];
  save_info: boolean;
  shipping_details?: CheckoutShippingDetailsPayload;
  shipping_method?: string;
};

type CreatePaymentIntentResponse = {
  clientSecret: string;
  shippingCost?: number;
  freeShippingApplied?: boolean;
  freeShippingThreshold?: number | string | null;
};

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(
    EMPTY_SHIPPING_DETAILS,
  );
  const [shippingMethod, setShippingMethod] = useState("budget");
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);
  const [freeShippingApplied, setFreeShippingApplied] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<
    number | null
  >(null);
  const [saveInfo, setSaveInfo] = useState(true);
  const [isUpdatingIntent, setIsUpdatingIntent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const latestIntentRequestId = useRef(0);

  const resetCheckoutIntentState = () => {
    setClientSecret("");
    setCalculatedShippingCost(0);
    setFreeShippingApplied(false);
    setFreeShippingThreshold(null);
  };

  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const hasPhysicalItems = useMemo(
    () => cartHasPhysicalItems(cartItems),
    [cartItems],
  );
  const hasDigitalItems = useMemo(
    () => cartHasDigitalItems(cartItems),
    [cartItems],
  );
  const checkoutCartItems = useMemo(() => cartItems, [cartItems]);
  const checkoutSuccessContext = useMemo<CheckoutSuccessContext>(
    () => ({
      hasDigitalItems,
      hasPhysicalItems,
      itemCount: checkoutCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    }),
    [checkoutCartItems, hasDigitalItems, hasPhysicalItems],
  );
  const requiresAuthenticatedCheckout = hasDigitalItems;
  const physicalAddressKey = useMemo(
    () =>
      hasPhysicalItems
        ? [
            shippingDetails.name,
            shippingDetails.email,
            shippingDetails.phone,
            shippingDetails.line1,
            shippingDetails.line2,
            shippingDetails.city,
            shippingDetails.state,
            shippingDetails.country,
            shippingDetails.postal_code,
          ].join("|")
        : "",
    [hasPhysicalItems, shippingDetails],
  );
  const shippingMethodKey = hasPhysicalItems ? shippingMethod : "";
  const isShippingCostPending =
    hasPhysicalItems &&
    (!hasCompletePhysicalAddress(shippingDetails) || isUpdatingIntent);
  const hasResolvedAccountEmail = Boolean(
    isAuthenticated && profileData?.email,
  );

  useEffect(() => {
    if (isAuthenticated) {
      getProfile()
        .then((profile) => setProfileData(profile))
        .catch((e) => console.error("Profile fetch error", e));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !profileData?.email) return;
    setShippingDetails((prev) =>
      prev.email === profileData.email
        ? prev
        : { ...prev, email: profileData.email },
    );
  }, [isAuthenticated, profileData?.email]);

  useEffect(() => {
    let isCancelled = false;

    const initializeCheckout = async () => {
      const requestId = ++latestIntentRequestId.current;

      if (checkoutCartItems.length === 0) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        resetCheckoutIntentState();
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      if (requiresAuthenticatedCheckout && !isAuthenticated) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        resetCheckoutIntentState();
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      if (hasPhysicalItems && !hasCompletePhysicalAddress(shippingDetails)) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        resetCheckoutIntentState();
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      if (isCancelled || requestId !== latestIntentRequestId.current) return;
      setIsUpdatingIntent(true);
      setFreeShippingApplied(false);
      setCheckoutError(null);

      try {
        const simplifiedCart: CheckoutCartItemPayload[] = checkoutCartItems.map(
          (item) => {
            const productType = item.product.product_type;
            if (
              !isPhysicalProductType(productType) &&
              !isDigitalProductType(productType)
            ) {
              throw new Error(
                "One or more bag items have an unsupported product type. Remove and re-add the item.",
              );
            }

            if (isPhysicalProductType(productType)) {
              const rawVariantId = isPhysicalCartOptions(item.options)
                ? item.options.variantId
                : Number(item.product.id);
              const variantId = Number(rawVariantId);
              if (!Number.isFinite(variantId) || variantId <= 0) {
                throw new Error(
                  "One or more print options are invalid. Remove and re-add the item.",
                );
              }

              return {
                product_id: variantId,
                product_type: "physical",
                quantity: item.quantity,
                options: {
                  material: isPhysicalCartOptions(item.options)
                    ? item.options.material
                    : undefined,
                  size: isPhysicalCartOptions(item.options)
                    ? item.options.size
                    : undefined,
                  variantId,
                },
              };
            }

            return {
              product_id: item.product.id,
              product_type: productType,
              quantity: item.quantity,
            };
          },
        );

        const payload: CreatePaymentIntentPayload = {
          cart: simplifiedCart,
          save_info: saveInfo,
        };

        if (hasPhysicalItems) {
          payload.shipping_details = {
            name: shippingDetails.name,
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            address: {
              line1: shippingDetails.line1,
              line2: shippingDetails.line2,
              city: shippingDetails.city,
              state: shippingDetails.state,
              country: shippingDetails.country,
              postal_code: shippingDetails.postal_code,
            },
          };
          payload.shipping_method = shippingMethod;
        }

        const response = await api.post<CreatePaymentIntentResponse>(
          "checkout/create-payment-intent/",
          payload,
        );
        if (isCancelled || requestId !== latestIntentRequestId.current) return;

        setClientSecret(response.data.clientSecret);
        setCalculatedShippingCost(
          hasPhysicalItems ? Number(response.data.shippingCost ?? 0) : 0,
        );
        setFreeShippingApplied(Boolean(response.data.freeShippingApplied));
        const parsedFreeShippingThreshold = Number(
          response.data.freeShippingThreshold,
        );
        setFreeShippingThreshold(
          Number.isFinite(parsedFreeShippingThreshold)
            ? parsedFreeShippingThreshold
            : null,
        );
      } catch (error) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        resetCheckoutIntentState();
        setCheckoutError(
          getApiErrorMessage(error) ||
            "We could not prepare checkout right now. Please review your details and try again.",
        );
      } finally {
        if (!isCancelled && requestId === latestIntentRequestId.current) {
          setIsUpdatingIntent(false);
        }
      }
    };

    initializeCheckout();

    return () => {
      isCancelled = true;
    };
  }, [
    checkoutCartItems,
    hasPhysicalItems,
    isAuthenticated,
    physicalAddressKey,
    requiresAuthenticatedCheckout,
    saveInfo,
    shippingMethodKey,
  ]);

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#00c853",
          colorBackground: "#1a1a1a",
          colorText: "#ffffff",
          colorDanger: "#ef4444",
          fontFamily: "sans-serif",
          borderRadius: "12px",
        },
      },
    }),
    [clientSecret],
  );

  return (
    <div className="min-h-screen bg-black text-white pt-20 mobile-page-offset pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <FaShieldAlt className="text-accent" />
            <span className="text-sm text-gray-300">Secure Checkout</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Finalise Your Order
          </h1>
          <p className="text-gray-400 text-lg">
            {hasPhysicalItems
              ? "Enter your details and complete payment to start processing your order."
              : "Complete payment to receive your digital purchase instantly."}
          </p>
          {requiresAuthenticatedCheckout && !isAuthenticated && (
            <div className="mt-6 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-5 py-4 text-sm text-gray-200">
              Digital purchases require an account so we can attach downloads to
              your order history.
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/login"
                  state={{ from: { pathname: "/checkout" } }}
                  className="rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-black hover:bg-white"
                >
                  Log In to Continue
                </Link>
                <Link
                  to="/register"
                  state={{ from: { pathname: "/checkout" } }}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            {requiresAuthenticatedCheckout &&
            !isAuthenticated ? null : clientSecret ? (
              <Elements
                key={clientSecret}
                options={options}
                stripe={stripePromise}
              >
                <CheckoutForm
                  initialData={profileData}
                  shippingDetails={shippingDetails}
                  onShippingChange={setShippingDetails}
                  saveInfo={saveInfo}
                  onSaveInfoChange={setSaveInfo}
                  shippingMethod={shippingMethod}
                  onShippingMethodChange={setShippingMethod}
                  isUpdatingIntent={isUpdatingIntent}
                  isPaymentReady={Boolean(clientSecret)}
                  isAuthenticated={hasResolvedAccountEmail}
                  accountEmail={profileData?.email ?? null}
                  successContext={checkoutSuccessContext}
                  isStripeContextAvailable={true}
                />
              </Elements>
            ) : (
              <CheckoutForm
                initialData={profileData}
                shippingDetails={shippingDetails}
                onShippingChange={setShippingDetails}
                saveInfo={saveInfo}
                onSaveInfoChange={setSaveInfo}
                shippingMethod={shippingMethod}
                onShippingMethodChange={setShippingMethod}
                isUpdatingIntent={isUpdatingIntent}
                isPaymentReady={false}
                isAuthenticated={hasResolvedAccountEmail}
                accountEmail={profileData?.email ?? null}
                successContext={checkoutSuccessContext}
                isStripeContextAvailable={false}
              />
            )}
            {checkoutError && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-bold">
                {checkoutError}
              </div>
            )}
            {!clientSecret &&
              !checkoutError &&
              !(requiresAuthenticatedCheckout && !isAuthenticated) && (
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm text-center">
                  {hasPhysicalItems
                    ? isUpdatingIntent
                      ? "Updating checkout totals and payment options..."
                      : "Add your delivery details to load payment options."
                    : "Payment form is preparing. Please wait a moment."}
                </div>
              )}
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <OrderSummary
              isCheckoutPage
              shippingCost={calculatedShippingCost}
              isShippingPending={isShippingCostPending}
              freeShippingApplied={freeShippingApplied}
              freeShippingThreshold={freeShippingThreshold}
              shippingCountry={shippingDetails.country}
            />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaLock /> SSL Secured - Stripe Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
