/// <reference types="vite/client" />

import React, { useState, useEffect, useMemo, useRef } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import {
  isPhysicalCartOptions,
  useCart,
} from "../context/CartContext";
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
import {
  EMPTY_SHIPPING_DETAILS,
  ShippingDetails,
} from "../types/checkout";

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

const hasCompletePhysicalAddress = (shippingDetails: ShippingDetails): boolean => {
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
    return typeof shippingDetails.state === "string" &&
      shippingDetails.state.trim().length > 0;
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
};

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Lifted States
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(
    EMPTY_SHIPPING_DETAILS,
  );
  const [shippingMethod, setShippingMethod] = useState("budget");
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);
  const [saveInfo, setSaveInfo] = useState(true);
  const [isUpdatingIntent, setIsUpdatingIntent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const latestIntentRequestId = useRef(0);

  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const hasPhysicalItems = useMemo(() => cartHasPhysicalItems(cartItems), [cartItems]);
  const hasDigitalItems = useMemo(() => cartHasDigitalItems(cartItems), [cartItems]);
  const checkoutCartItems = useMemo(
    () => cartItems,
    [cartItems],
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

  // 1. Fetch Profile on Mount
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
      prev.email === profileData.email ? prev : { ...prev, email: profileData.email },
    );
  }, [isAuthenticated, profileData?.email]);

  // 2. Dynamic Payment Intent Fetcher
  useEffect(() => {
    let isCancelled = false;

    const initializeCheckout = async () => {
      const requestId = ++latestIntentRequestId.current;

      if (checkoutCartItems.length === 0) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        setClientSecret("");
        setCalculatedShippingCost(0);
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      if (requiresAuthenticatedCheckout && !isAuthenticated) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        setClientSecret("");
        setCalculatedShippingCost(0);
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      if (hasPhysicalItems && !hasCompletePhysicalAddress(shippingDetails)) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        setClientSecret("");
        setCalculatedShippingCost(0);
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      if (isCancelled || requestId !== latestIntentRequestId.current) return;
      setIsUpdatingIntent(true);
      setCheckoutError(null);

      try {
        const simplifiedCart: CheckoutCartItemPayload[] = checkoutCartItems.map((item) => {
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
              product_id: item.product.id,
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
        });

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
      } catch (error) {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        console.error("Error creating payment intent:", error);
        setClientSecret("");
        const apiMessage = getApiErrorMessage(error);
        setCheckoutError(
          apiMessage ??
            (error instanceof Error
              ? error.message
              : "Unable to initialize checkout. Please review your bag and try again."),
        );
      } finally {
        if (isCancelled || requestId !== latestIntentRequestId.current) return;
        setIsUpdatingIntent(false);
      }
    };

    // Delay slightly to prevent spamming the API while typing address
    const timeoutId = setTimeout(() => {
      initializeCheckout();
    }, 500);

    return () => {
      isCancelled = true;
      latestIntentRequestId.current += 1;
      clearTimeout(timeoutId);
    };

    // Refetch if cart, country, or speed changes
  }, [
    checkoutCartItems,
    hasPhysicalItems,
    requiresAuthenticatedCheckout,
    isAuthenticated,
    physicalAddressKey,
    shippingMethodKey,
    saveInfo,
  ]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#16a34a",
        colorBackground: "#000000",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backgroundColor: "#000000",
        },
        ".Input:focus": {
          border: "1px solid #16a34a",
        },
      },
    },
  };

  const fallbackElementsOptions: StripeElementsOptions = {
    mode: "payment",
    amount: 100,
    currency: "eur",
    appearance: options.appearance,
  };

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20 mobile-page-offset">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Secure Checkout
          </h1>
          <div className="flex items-center gap-2 text-green-500 text-sm font-bold uppercase tracking-wider">
            <FaLock />
            <span className="hidden md:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            {checkoutCartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Checkout Unavailable
                </p>
                <p>Your bag is empty.</p>
              </div>
            ) : requiresAuthenticatedCheckout && !isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-sm uppercase tracking-widest font-bold text-gray-300 mb-3">
                  Login Required
                </p>
                <p className="text-center max-w-lg mb-6">
                  Digital purchases are account-bound for secure download
                  access. Please sign in to continue checkout.
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: "/checkout" } }}
                  className="px-6 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-white transition-colors"
                >
                  Log In to Continue
                </Link>
              </div>
            ) : (
              <Elements
                key={clientSecret || "draft-elements"}
                options={clientSecret ? options : fallbackElementsOptions}
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
                  isAuthenticated={isAuthenticated}
                  accountEmail={profileData?.email ?? null}
                />
              </Elements>
            )}
            {checkoutError && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-bold">
                {checkoutError}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              {/* Pass the dynamic shipping cost to your summary component! */}
              <OrderSummary
                isCheckoutPage={true}
                shippingCost={calculatedShippingCost}
                isShippingPending={isShippingCostPending}
              />

              <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <FaShieldAlt className="text-2xl text-gray-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      Purchase Protection
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Your transaction is secured by Stripe. We do not store
                      your credit card information on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
