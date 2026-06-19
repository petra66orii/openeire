"use client";

import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { BagItem } from "@/components/cart/BagItem";
import { useCart } from "@/components/cart/CartProvider";
import { OrderSummary } from "@/components/cart/OrderSummary";

export function ShoppingBagClient() {
  const { items, clearCart, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="sr-only">Loading shopping bag</span>
      </div>
    );
  }

  return (
    <div className="page-top-offset min-h-screen bg-black pb-24 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Shopping Bag
              </p>
              <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
                Your selected pieces
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
                Review art prints and personal-use digital assets before moving
                into secure checkout.
              </p>
            </div>

            {items.length ? (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex w-fit items-center justify-center rounded-full border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-red-400/40 hover:text-red-200"
              >
                Clear Bag
              </button>
            ) : null}
          </div>

          {!items.length ? (
            <div className="rounded-3xl border border-white/10 bg-gray-950/80 px-6 py-16 text-center shadow-2xl shadow-black/30">
              <FaShoppingBag
                className="mx-auto text-4xl text-accent"
                aria-hidden="true"
              />
              <h2 className="mt-6 font-serif text-3xl font-bold">
                Your bag is empty
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
                Add a fine art print or, if you have gallery access, a
                personal-use digital asset.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/gallery/physical"
                  className="rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-brand-500"
                >
                  Browse Art Prints
                </Link>
                <Link
                  href="/gallery-gate?next=/gallery/digital"
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Browse Digital Gallery
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
              <div className="space-y-5">
                {items.map((item) => (
                  <BagItem key={item.cartId} item={item} />
                ))}
              </div>
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
