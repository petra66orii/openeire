"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { formatCartCurrency, getCartTotal } from "@/lib/cart/pricing";

export function OrderSummary() {
  const { items } = useCart();
  const { isAuthenticated } = useAuth();
  const cartTotal = useMemo(() => getCartTotal(items), [items]);
  const hasPhysicalItems = items.some((item) => item.product.product_type === "physical");
  const hasDigitalItems = items.some((item) => item.product.product_type !== "physical");
  const needsLoginForDigital = hasDigitalItems && !isAuthenticated;

  return (
    <aside className="rounded-2xl border border-white/10 bg-gray-950/90 p-6 shadow-2xl shadow-black/30 lg:sticky lg:top-32">
      <h2 className="font-serif text-2xl font-bold text-white">Order Summary</h2>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-400">Items</dt>
          <dd className="font-semibold text-white">{items.length}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-400">Estimated subtotal</dt>
          <dd className="font-serif text-2xl font-bold text-white">
            {formatCartCurrency(cartTotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-400">Delivery</dt>
          <dd className="text-right font-semibold text-white">
            {hasPhysicalItems ? "Calculated at checkout" : "No delivery charge"}
          </dd>
        </div>
        {hasDigitalItems ? (
          <div className="rounded-xl border border-accent/15 bg-accent/10 p-3 text-xs leading-relaxed text-gray-300">
            Digital downloads require an authenticated account and are delivered
            through secure, one-time links after payment.
          </div>
        ) : null}
      </dl>

      <div className="mt-6 border-t border-white/10 pt-6">
        {needsLoginForDigital ? (
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-brand-700 px-5 py-4 text-sm font-bold text-paper transition-colors hover:bg-brand-500"
          >
            Sign in before checkout
          </Link>
        ) : (
          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-xl bg-brand-700 px-5 py-4 text-sm font-bold text-paper transition-colors hover:bg-brand-500"
          >
            Continue to checkout
          </Link>
        )}
        <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">
          Shipping, discounts, and final totals are calculated securely by the
          backend during checkout.
        </p>
      </div>
    </aside>
  );
}
