import React, { useRef } from "react";
import { GalleryItem } from "../services/api";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="border-t border-white/10 pt-12 relative group">
      <div className="flex justify-between items-end mb-8 px-1">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
          You Might Also Like
        </h3>

        {/* Navigation Buttons */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Scroll Left"
          >
            <FaChevronLeft className="mr-0.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Scroll Right"
          >
            <FaChevronRight className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((item) => (
          <div
            key={item.id}
            className="min-w-[280px] md:min-w-[320px] snap-start flex-shrink-0"
          >
            <ProductCard product={item} contextType={contextType} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
