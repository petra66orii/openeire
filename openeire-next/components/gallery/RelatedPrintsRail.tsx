"use client";

import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GalleryProductCard } from "@/components/gallery/GalleryProductCard";
import type { PublicGalleryItem } from "@/types/gallery";

export function RelatedPrintsRail({
  products,
}: {
  products: PublicGalleryItem[];
}) {
  const railRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollByCard = (direction: "left" | "right") => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mt-20 border-t border-white/10 pt-12">
      <div className="mb-8 flex items-end justify-between gap-4 px-1">
        <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
          You Might Also Like
        </h2>
        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent hover:text-accent"
            aria-label="Scroll related prints left"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent hover:text-accent"
            aria-label="Scroll related prints right"
          >
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 md:mx-0 md:px-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex w-[280px] shrink-0 snap-start md:w-[320px]"
          >
            <GalleryProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
