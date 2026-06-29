"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GalleryProductCard } from "@/components/gallery/GalleryProductCard";
import { getShoppingBagRecommendations } from "@/lib/api/gallery";
import type { PublicGalleryItem } from "@/types/gallery";

export function BagRecommendations() {
  const [recommendations, setRecommendations] = useState<PublicGalleryItem[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getShoppingBagRecommendations()
      .then((items) => {
        if (isMounted) setRecommendations(items.slice(0, 4));
      })
      .catch(() => {
        if (isMounted) setRecommendations([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!recommendations.length) return null;

  const scrollByCard = (direction: "left" | "right") => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mt-20 border-t border-white/10 pt-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
            You might also like
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-white">
            Continue the collection
          </h2>
        </div>
        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent hover:text-accent"
            aria-label="Scroll recommendations left"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent hover:text-accent"
            aria-label="Scroll recommendations right"
          >
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 md:mx-0 md:px-0"
      >
        {recommendations.map((product) => (
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
