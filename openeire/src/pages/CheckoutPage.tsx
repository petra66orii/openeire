/// <reference types="vite/client" />

import React, { useState, useEffect, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProfile, UserProfile, api } from "../services/api";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import {
  isDigitalProductType,
  isPhysicalProductType,
  isValidDigitalLicense,
} from "../utils/purchaseFlow";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

  return null;
};

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Lifted States
  const [shippingDetails, setShippingDetails] = useState<any>({});
  const [shippingMethod, setShippingMethod] = useState("budget");
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);
  const [saveInfo, setSaveInfo] = useState(true);
  const [isUpdatingIntent, setIsUpdatingIntent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const hasPhysicalItems = useMemo(
    () => cartItems.some((item) => item.product.product_type === "physical"),
    [cartItems],
  );
  const checkoutCartItems = useMemo(
    () => cartItems,
    [cartItems],
  );

  // 1. Fetch Profile on Mount
  useEffect(() => {
    if (isAuthenticated) {
      getProfile()
        .then((profile) => setProfileData(profile))
        .catch((e) => console.error("Profile fetch error", e));
    }
  }, [isAuthenticated]);

  // 2. Dynamic Payment Intent Fetcher
  useEffect(() => {
    const initializeCheckout = async () => {
      if (checkoutCartItems.length === 0) {
        setClientSecret("");
        setCalculatedShippingCost(0);
        setCheckoutError(null);
        setIsUpdatingIntent(false);
        return;
      }

      setIsUpdatingIntent(true);
      setCheckoutError(null);

      try {
        const simplifiedCart = checkoutCartItems.map((item) => {
          const productType = item.product.product_type;
          if (
            !isPhysicalProductType(productType) &&
            !isDigitalProductType(productType)
          ) {
            throw new Error(
              "One or more bag items have an unsupported product type. Remove and re-add the item.",
            );
          }

          if (
            isDigitalProductType(productType) &&
            !isValidDigitalLicense(item.options?.license)
          ) {
            throw new Error(
              "One or more digital licence options are invalid. Remove and re-add the item.",
            );
          }

          const sanitizedOptions = isPhysicalProductType(productType)
            ? (() => {
                const rawVariantId =
                  item.options?.variantId ?? Number(item.product.id);
                const variantId = Number(rawVariantId);
                if (!Number.isFinite(variantId) || variantId <= 0) {
                  throw new Error(
                    "One or more print options are invalid. Remove and re-add the item.",
                  );
                }

                return {
                  material: item.options?.material,
                  size: item.options?.size,
                  variantId,
                };
              })()
            : {
                license: item.options?.license,
              };

          return {
            product_id: item.product.id,
            product_type: productType,
            quantity: item.quantity,
            options: sanitizedOptions,
          };
        });

        const payload: Record<string, any> = {
          cart: simplifiedCart,
          save_info: saveInfo,
        };

        if (hasPhysicalItems) {
          payload.shipping_details = {
            address: { country: shippingDetails.country || "IE" },
          };
          payload.shipping_method = shippingMethod;
        }

        const response = await api.post("checkout/create-payment-intent/", payload);

        setClientSecret(response.data.clientSecret);
        setCalculatedShippingCost(
          hasPhysicalItems ? (response.data.shippingCost || 0) : 0,
        );
      } catch (error) {
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
        setIsUpdatingIntent(false);
      }
    };

    // Delay slightly to prevent spamming the API while typing address
    const timeoutId = setTimeout(() => {
      initializeCheckout();
    }, 500);

    return () => clearTimeout(timeoutId);

    // Refetch if cart, country, or speed changes
  }, [
    checkoutCartItems,
    hasPhysicalItems,
    shippingDetails.country,
    shippingMethod,
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

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
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
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  initialData={profileData}
                  onShippingChange={setShippingDetails}
                  onSaveInfoChange={setSaveInfo}
                  shippingMethod={shippingMethod}
                  onShippingMethodChange={setShippingMethod}
                  isUpdatingIntent={isUpdatingIntent}
                />
              </Elements>
            ) : checkoutCartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Checkout Unavailable
                </p>
                <p>Your bag is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent mb-4"></div>
                <p>Preparing secure connection...</p>
              </div>
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
