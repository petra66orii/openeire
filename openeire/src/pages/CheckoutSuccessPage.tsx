// src/pages/CheckoutSuccessPage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart(); // We will add this to CartContext

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="text-center container mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p>
        Thank you for your order. A confirmation email will be sent to you
        shortly.
      </p>
      <Link
        to="/gallery"
        className="text-green-600 hover:underline mt-4 inline-block"
      >
        Continue Shopping
      </Link>
    </div>
  );
};
export default CheckoutSuccessPage;
