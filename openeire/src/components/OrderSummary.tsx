import React, { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

interface OrderSummaryProps {
  isCheckoutPage?: boolean;
  shippingCost: number;
  isShippingPending?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  isCheckoutPage = false,
  shippingCost,
  isShippingPending = false,
}) => {
  const { cartItems: cart, cartTotal } = useCart();

  const hasPhysicalItems = useMemo(() => {
    return cart.some((item) => {
      return (
        item.options?.type === "physical" ||
        item.product?.product_type === "physical"
      );
    });
  }, [cart]);

  const grandTotal = cartTotal + shippingCost;

  return (
    <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-xl">
      <h2 className="text-xl font-serif font-bold text-white mb-6">Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Subtotal</span>
          <span className="text-white font-medium">
            €{cartTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Shipping</span>
          {isShippingPending ? (
            // 👇 NEW LOGIC: Show text if pending
            <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Calculated at checkout
            </span>
          ) : shippingCost === 0 ? (
            // 👇 Keep your Free logic if it's explicitly 0
            <span className="text-brand-500 font-bold uppercase tracking-wider text-xs mt-1">
              Free
            </span>
          ) : (
            // 👇 Show the calculated price
            <span className="text-white font-medium">
              €{shippingCost.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Total
          </span>
          <span className="text-3xl font-serif font-bold text-white">
            €{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {!isCheckoutPage && (
        <Link
          to="/checkout"
          className="block w-full text-center bg-brand-500 text-black font-bold text-lg py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,196,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform active:scale-[0.98]"
        >
          Checkout
        </Link>
      )}

      {isCheckoutPage && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-4">
          <FaLock /> Encrypted Connection
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
