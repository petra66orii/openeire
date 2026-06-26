"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { FaExpand, FaImage } from "react-icons/fa";
import { GalleryQuickAddModal } from "@/components/gallery/GalleryQuickAddModal";
import { formatEuro, getStartingPrice } from "@/lib/gallery/format";
import { resolveMediaUrl } from "@/lib/media";
import type { PublicGalleryItem } from "@/types/gallery";

export function GalleryProductCard({ product }: { product: PublicGalleryItem }) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const imageUrl =
    resolveMediaUrl(product.thumbnail_image || product.preview_image) ||
    "https://via.placeholder.com/400x300?text=No+Preview";
  const displayPrice = formatEuro(getStartingPrice(product));

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
        <Link
          href={`/gallery/physical/${product.id}`}
          className="absolute inset-0 block"
        >
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute right-3 top-3 z-20">
            <span className="flex items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-900 shadow-md backdrop-blur-md">
              <FaImage className="mr-1 text-[8px]" /> Fine Art Print
            </span>
          </div>
        </Link>

        <div className="pointer-events-none absolute bottom-0 left-0 z-30 flex w-full translate-y-full items-end justify-between bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <div className="text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Price
            </p>
            <span className="font-serif text-lg font-bold">
              From {"\u20AC"}
              {displayPrice}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(true)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-900 shadow-lg transition-all hover:bg-accent group-hover:scale-110"
            aria-label="Select print options"
          >
            <FaExpand className="text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/gallery/physical/${product.id}`}>
          <h2 className="mb-1 min-h-[3.5rem] font-serif text-lg font-bold leading-tight text-white transition-colors hover:text-accent">
            {product.title}
          </h2>
        </Link>
        <div className="mt-auto flex min-h-[2rem] items-center justify-between gap-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {product.collection}
          </p>
        </div>
      </div>
      {isQuickAddOpen ? (
        <GalleryQuickAddModal
          productId={product.id}
          onClose={() => setIsQuickAddOpen(false)}
        />
      ) : null}
    </article>
  );
}
