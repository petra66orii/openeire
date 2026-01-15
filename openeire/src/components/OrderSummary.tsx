import React, { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

interface OrderSummaryProps {
  isCheckoutPage?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  isCheckoutPage = false,
}) => {
  // 1. Get 'cart' from context so we can inspect items
  const { cartItems: cart, cartTotal } = useCart();

  // 2. Detect if there are any physical items
  const hasPhysicalItems = useMemo(() => {
    return cart.some((item) => {
      return (
        item.options?.type === "physical" ||
        item.product?.product_type === "physical"
      );
    });
  }, [cart]);

  // 3. Calculate Shipping Logic
  // Logic:
  // - If NO physical items (all digital) -> €0.00
  // - If Physical items exist -> Check threshold
  let shippingCost = 0;

  if (hasPhysicalItems) {
    shippingCost = cartTotal > 50 ? 0 : 5.99;
  }

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
        <span
          className={shippingCost === 0 ? "text-green-600 font-medium" : ""}
        >
          {shippingCost === 0 ? "Free" : `€${shippingCost.toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-4">
        <span>Total</span>
        <span>€{grandTotal.toFixed(2)}</span>
      </div>

      {!isCheckoutPage && (
        <Link
          to="/checkout"
          className="block w-full text-center bg-primary text-white py-3 rounded-md hover:bg-primary/90"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
};

export default OrderSummary;
