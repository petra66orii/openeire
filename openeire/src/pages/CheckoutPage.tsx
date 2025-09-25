/// <reference types="vite/client" />

// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProfile, UserProfile } from "../services/api";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { api } from "../services/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [shippingDetails, setShippingDetails] = useState({});
  const [saveInfo, setSaveInfo] = useState(true);
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // This function will be called by our useEffect hook
    const initializeCheckout = async () => {
      if (cartItems.length === 0) {
        return;
      }

      // Fetch the user profile only if they are authenticated
      let profile = null;
      if (isAuthenticated) {
        profile = await getProfile();
        setProfileData(profile);
      }

      try {
        // Create a simplified cart to send to the backend
        const simplifiedCart = cartItems.map((item) => ({
          product_id: item.product.id,
          product_type: item.product.product_type,
          quantity: item.quantity,
        }));

        const response = await api.post<{ clientSecret: string }>(
          "checkout/create-payment-intent/",
          {
            cart: simplifiedCart,
            shipping_details: profile,
            save_info: saveInfo,
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    initializeCheckout();
  }, [cartItems, isAuthenticated]); // <-- Simplified dependency array

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                initialData={profileData}
                onShippingChange={setShippingDetails}
                onSaveInfoChange={setSaveInfo}
              />
            </Elements>
          ) : (
            <p>Loading checkout...</p>
          )}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary isCheckoutPage={true} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
