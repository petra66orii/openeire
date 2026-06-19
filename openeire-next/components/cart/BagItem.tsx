"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "@/components/cart/CartProvider";
import {
  formatCartCurrency,
  getCartItemSubtotal,
  getCartItemUnitPrice,
} from "@/lib/cart/pricing";
import type { CartItem, PhysicalCartOptions } from "@/lib/cart/types";
import { resolveMediaUrl } from "@/lib/media";

const getItemPath = (item: CartItem): string => {
  if (item.product.product_type === "physical") {
    const options = item.options as PhysicalCartOptions | undefined;
    return `/gallery/physical/${options?.sourceProductId ?? item.product.id}`;
  }
  return `/gallery/${item.product.product_type}/${item.product.id}`;
};

const getItemTypeLabel = (item: CartItem): string => {
  if (item.product.product_type === "physical") return "Fine Art Print";
  if (item.product.product_type === "video") return "Digital Video";
  return "Digital Photo";
};

const getDeliveryLabel = (item: CartItem): string =>
  item.product.product_type === "physical"
    ? "Physical fulfilment"
    : "Digital delivery";

export function BagItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const imageUrl = resolveMediaUrl(
    item.product.preview_image || item.product.thumbnail_image,
  );
  const isPhysical = item.product.product_type === "physical";
  const href = getItemPath(item);

  return (
    <article className="grid gap-5 rounded-2xl border border-white/10 bg-gray-950/80 p-4 shadow-2xl shadow-black/20 sm:grid-cols-[8rem_1fr] sm:p-5">
      <Link
        href={href}
        prefetch={item.product.product_type === "physical" ? undefined : false}
        className="group relative aspect-square overflow-hidden rounded-xl bg-white/5"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs uppercase tracking-widest text-gray-600">
            Preview unavailable
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              {getItemTypeLabel(item)}
            </p>
            <Link
              href={href}
              prefetch={item.product.product_type === "physical" ? undefined : false}
              className="mt-2 block font-serif text-xl font-bold text-white transition-colors hover:text-accent"
            >
              {item.product.title}
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              {getDeliveryLabel(item)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-serif text-2xl font-bold text-white">
              {formatCartCurrency(getCartItemSubtotal(item))}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatCartCurrency(getCartItemUnitPrice(item))} each
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {isPhysical ? (
            <div className="inline-flex w-fit items-center overflow-hidden rounded-full border border-white/10 bg-black/40">
              <button
                type="button"
                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                className="flex h-10 w-10 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`Decrease quantity for ${item.product.title}`}
              >
                <FaMinus aria-hidden="true" />
              </button>
              <span className="min-w-12 text-center text-sm font-bold text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                className="flex h-10 w-10 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`Increase quantity for ${item.product.title}`}
              >
                <FaPlus aria-hidden="true" />
              </button>
            </div>
          ) : (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Quantity fixed at 1 for personal-use digital purchases
            </p>
          )}

          <button
            type="button"
            onClick={() => removeItem(item.cartId)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-400 transition-colors hover:border-red-400/40 hover:text-red-200"
          >
            <FaTrash aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
