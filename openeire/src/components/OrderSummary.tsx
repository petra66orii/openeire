import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const OrderSummary: React.FC = () => {
  const { cartTotal } = useCart();
  // We'll add real shipping cost logic later
  const shippingCost = cartTotal > 50 ? 0 : 5.99;
  const grandTotal = cartTotal + shippingCost;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold border-b pb-4">Order Summary</h2>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>€{cartTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>
          {shippingCost === 0 ? "Free" : `€${shippingCost.toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-4">
        <span>Total</span>
        <span>€{grandTotal.toFixed(2)}</span>
      </div>
      <Link
        to="/checkout"
        className="block w-full text-center bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default OrderSummary;
