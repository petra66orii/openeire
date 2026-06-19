"use client";

import { useCart } from "@/components/cart/CartProvider";

export function CartBadge() {
  const { itemCount, isLoaded } = useCart();

  if (!isLoaded || itemCount <= 0) return null;

  return (
    <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-black">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
