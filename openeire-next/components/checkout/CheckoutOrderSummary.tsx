"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatCartCurrency, getCartTotal } from "@/lib/cart/pricing";
import type { CartItem } from "@/lib/cart/types";
import type {
  AppliedDiscount,
  PaymentIntentQuote,
} from "@/types/checkout";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  appliedDiscount: AppliedDiscount | null;
  paymentQuote: PaymentIntentQuote | null;
  hasPhysicalItems: boolean;
  hasDigitalItems: boolean;
}

const getItemTypeLabel = (item: CartItem): string => {
  if (item.product.product_type === "physical") return "Fine Art Print";
  if (item.product.product_type === "video") return "Digital Video";
  return "Digital Photo";
};

export function CheckoutOrderSummary({
  items,
  appliedDiscount,
  paymentQuote,
  hasPhysicalItems,
  hasDigitalItems,
}: CheckoutOrderSummaryProps) {
  const subtotal = useMemo(() => getCartTotal(items), [items]);
  const discountAmount =
    paymentQuote?.discountAmount ?? appliedDiscount?.amount ?? 0;
  const shippingCost = paymentQuote?.shippingCost ?? 0;
  const displayedTotal =
    paymentQuote?.totalPrice ??
    Math.max(0, subtotal + shippingCost - discountAmount);
  const discountCode =
    paymentQuote?.discountCode ?? appliedDiscount?.code ?? null;

  return (
    <section className="rounded-2xl border border-white/10 bg-gray-950/90 p-6 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">
            Order Summary
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            {paymentQuote
              ? "Confirmed securely by the backend for this payment session."
              : "Estimated only. Final totals are confirmed securely before payment."}
          </p>
        </div>
        <Link
          href="/bag"
          className="text-xs font-bold uppercase tracking-[0.18em] text-accent hover:underline"
        >
          Edit
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.cartId}
            className="rounded-xl border border-white/10 bg-black/40 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                  {getItemTypeLabel(item)}
                </p>
                <p className="mt-1 font-semibold text-white">{item.product.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.product.product_type === "physical"
                    ? `Quantity ${item.quantity} · Physical fulfilment`
                    : "Personal-use digital delivery"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <dl className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-400">Subtotal</dt>
          <dd className="font-semibold text-white">{formatCartCurrency(subtotal)}</dd>
        </div>

        {discountCode && discountAmount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-400">
              Discount{" "}
              <span className="text-xs uppercase text-accent">
                ({discountCode})
              </span>
            </dt>
            <dd className="font-semibold text-brand-300">
              -{formatCartCurrency(discountAmount)}
            </dd>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-400">Shipping</dt>
          <dd className="text-right font-semibold text-white">
            {hasPhysicalItems
              ? paymentQuote
                ? paymentQuote.freeShippingApplied
                  ? "Free delivery"
                  : formatCartCurrency(shippingCost)
                : "Calculated at payment step"
              : "No delivery charge"}
          </dd>
        </div>

        {hasDigitalItems ? (
          <div className="rounded-xl border border-accent/15 bg-accent/10 p-3 text-xs leading-relaxed text-gray-300">
            Digital purchases are attached to your account and delivered through
            secure one-time links after successful payment.
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <dt className="font-serif text-lg font-bold text-white">
            {paymentQuote ? "Total" : "Estimated total"}
          </dt>
          <dd className="font-serif text-2xl font-bold text-white">
            {formatCartCurrency(displayedTotal)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
