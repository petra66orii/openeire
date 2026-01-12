import React, { useRef } from "react";
import { GalleryItem } from "../services/api";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: GalleryItem[];
  contextType: "digital" | "physical" | "all";
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  contextType,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300; // Approximate card width + gap
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-200 relative group">
      <div className="flex justify-between items-end mb-6 px-1">
        <h3 className="text-2xl font-bold font-sans text-gray-900">
          You Might Also Like
        </h3>

        {/* Navigation Buttons (Visible on desktop) */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors"
            aria-label="Scroll Left"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors"
            aria-label="Scroll Right"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hides scrollbar in Firefox/IE
      >
        {products.map((item) => (
          <div
            key={item.id}
            className="min-w-[280px] md:min-w-[300px] snap-start flex-shrink-0"
          >
            <ProductCard product={item} contextType={contextType} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
