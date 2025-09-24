/// <reference types="vite/client" />

// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart, CartItem } from "../context/CartContext";
import CheckoutForm from "../components/CheckoutForm";
import { api } from "../services/api";
import OrderSummary from "../components/OrderSummary";

// --- We need to add a createPaymentIntent function to api.ts ---
const createPaymentIntent = async (
  cart: CartItem[]
): Promise<{ clientSecret: string }> => {
  // --- Start of new logic ---
  // Create a simplified version of the cart to send to the backend
  const simplifiedCart = cart.map((item) => ({
    product_id: item.product.id,
    product_type: item.product.product_type,
    quantity: item.quantity,
    // Add other selected options here if you have them, e.g., quality: '4k'
  }));
  // --- End of new logic ---

  // Send the simplified cart instead of the full cart
  const response = await api.post<{ clientSecret: string }>(
    "checkout/create-payment-intent/",
    { cart: simplifiedCart }
  );
  return response.data;
};

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payment Form */}
        <div className="lg:col-span-2">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary isCheckoutPage={true} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
