/// <reference types="vite/client" />

// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import CheckoutForm from "../components/CheckoutForm";
import { api } from "../services/api"; // We'll add createPaymentIntent to api.ts

// --- We need to add a createPaymentIntent function to api.ts ---
const createPaymentIntent = async (
  cart: any
): Promise<{ clientSecret: string }> => {
  const response = await api.post<{ clientSecret: string }>(
    "checkout/create-payment-intent/",
    { cart }
  );
  return response.data;
};
// ---

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { cartItems } = useCart();

  useEffect(() => {
    if (cartItems.length > 0) {
      createPaymentIntent(cartItems)
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) =>
          console.error("Error creating payment intent:", error)
        );
    }
  }, [cartItems]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutPage;
