/// <reference types="vite/client" />

import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProfile, UserProfile, api } from "../services/api";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Lifted States
  const [shippingDetails, setShippingDetails] = useState<any>({});
  const [shippingMethod, setShippingMethod] = useState("budget");
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);
  const [saveInfo, setSaveInfo] = useState(true);
  const [isUpdatingIntent, setIsUpdatingIntent] = useState(false);

  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();

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
      if (cartItems.length === 0) return;

      setIsUpdatingIntent(true);

      try {
        const simplifiedCart = cartItems.map((item) => ({
          product_id: item.product.id,
          product_type: item.product.product_type,
          quantity: item.quantity,
          options: item.options, // Ensure options (licenses) are passed
        }));

        const response = await api.post("checkout/create-payment-intent/", {
          cart: simplifiedCart,
          // Pass the currently selected country to calculate exact rates
          shipping_details: {
            address: { country: shippingDetails.country || "IE" },
          },
          shipping_method: shippingMethod,
          save_info: saveInfo,
        });

        setClientSecret(response.data.clientSecret);
        setCalculatedShippingCost(response.data.shippingCost || 0);
      } catch (error) {
        console.error("Error creating payment intent:", error);
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
  }, [cartItems, shippingDetails.country, shippingMethod]);

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
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent mb-4"></div>
                <p>Preparing secure connection...</p>
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
