import React, { useMemo } from "react";
import { getCartItemUnitPrice, useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import {
  cartHasDigitalItems,
  cartHasPhysicalItems,
  isPhysicalProductType,
} from "../utils/purchaseFlow";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
  isFreeShippingCountryEligible,
} from "../utils/freeShipping";

interface OrderSummaryProps {
  isCheckoutPage?: boolean;
  shippingCost: number;
  isShippingPending?: boolean;
  freeShippingApplied?: boolean;
  freeShippingThreshold?: number | null;
  shippingCountry?: string | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  isCheckoutPage = false,
  shippingCost,
  isShippingPending = false,
  freeShippingApplied = false,
  freeShippingThreshold = null,
  shippingCountry = null,
}) => {
  const { cartItems: cart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const hasPhysicalItems = useMemo(() => cartHasPhysicalItems(cart), [cart]);
  const hasDigitalItems = useMemo(() => cartHasDigitalItems(cart), [cart]);
  const hasItems = cart.length > 0;
  const isPhysicalShippingPending = hasPhysicalItems && isShippingPending;
  const physicalSubtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        if (!isPhysicalProductType(item.product?.product_type)) return total;
        return total + getCartItemUnitPrice(item) * item.quantity;
      }, 0),
    [cart],
  );
  const effectiveFreeShippingThreshold =
    freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(
    0,
    effectiveFreeShippingThreshold - physicalSubtotal,
  );
  const countryEligibleForPromo = isFreeShippingCountryEligible(shippingCountry);
  const showFreeShippingPromo =
    FREE_SHIPPING_PROMO_ENABLED && hasPhysicalItems;

  const grandTotal =
    cartTotal + (hasPhysicalItems && !isPhysicalShippingPending ? shippingCost : 0);

  return (
    <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl shadow-xl">
      <h2 className="text-xl font-serif font-bold text-white mb-6">Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Subtotal</span>
          <span className="text-white font-medium">{"\u20AC"}{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Shipping</span>
          {!hasPhysicalItems ? (
            <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Not applicable
            </span>
          ) : isPhysicalShippingPending ? (
            <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Calculated after address
            </span>
          ) : freeShippingApplied ? (
            <span className="text-brand-500 font-bold uppercase tracking-wider text-xs mt-1">
              Free
            </span>
          ) : (
            <span className="text-white font-medium">{"\u20AC"}{shippingCost.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
            {isPhysicalShippingPending ? "Current Total" : "Total"}
          </span>
          <span className="text-3xl font-serif font-bold text-white">
            {"\u20AC"}{grandTotal.toFixed(2)}
          </span>
        </div>
        {isPhysicalShippingPending && (
          <p className="mt-2 text-right text-xs text-gray-500">
            Shipping will be added after delivery details are entered.
          </p>
        )}
        {showFreeShippingPromo && freeShippingApplied && (
          <p className="mt-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-500">
            Free shipping applied for {FREE_SHIPPING_COUNTRY_LABEL} delivery.
          </p>
        )}
        {showFreeShippingPromo && !freeShippingApplied && (
          <>
            {shippingCountry && !countryEligibleForPromo ? (
              <p className="mt-3 text-right text-xs text-gray-500">
                Free shipping is currently available for {FREE_SHIPPING_COUNTRY_LABEL} delivery only.
              </p>
            ) : remainingForFreeShipping > 0 ? (
              <p className="mt-3 text-right text-xs text-gray-500">
                Spend {"\u20AC"}{remainingForFreeShipping.toFixed(2)} more on prints to qualify
                for free shipping in {FREE_SHIPPING_COUNTRY_LABEL}.
              </p>
            ) : (
              <p className="mt-3 text-right text-xs text-gray-500">
                This print order can qualify for free shipping in {FREE_SHIPPING_COUNTRY_LABEL}
                once delivery details are confirmed.
              </p>
            )}
          </>
        )}
      </div>

      {!isCheckoutPage &&
        (hasItems ? (
          hasDigitalItems && !isAuthenticated ? (
            <Link
              to="/login"
              state={{ from: { pathname: "/checkout" } }}
              className="block w-full text-center bg-brand-500 text-black font-bold text-lg py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,196,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform active:scale-[0.98]"
            >
              Log In to Checkout
            </Link>
          ) : (
            <Link
              to="/checkout"
              className="block w-full text-center bg-brand-500 text-black font-bold text-lg py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,196,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transform active:scale-[0.98]"
            >
              Checkout
            </Link>
          )
        ) : (
          <div className="block w-full text-center bg-white/10 text-gray-400 font-bold text-lg py-4 rounded-xl cursor-not-allowed">
            Your bag is empty
          </div>
        ))}

      {isCheckoutPage && (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-4">
          <FaLock /> Encrypted Connection
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
