import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getGalleryProducts, GalleryItem } from "../services/api";
import ProductCard from "../components/ProductCard";
import VisualCategoryHero from "../components/VisualCategoryHero";
import MinimalToolbar from "../components/MinimalToolbar";
import Masonry from "react-masonry-css";

type GalleryType = "digital" | "physical" | "all";

// Define Breakpoints for columns
const breakpointColumnsObj = {
  default: 4, // 4 columns on big screens
  1100: 3,
  700: 2,
  500: 1, // 1 column on mobile
};

const GalleryPage: React.FC = () => {
  const { type: paramType } = useParams<{ type?: string }>();
  const location = useLocation();

  // 1. Determine Type (Same logic as before)
  const type: GalleryType = useMemo(() => {
    if (paramType === "digital" || paramType === "physical") return paramType;
    if (location.pathname.includes("/digital")) return "digital";
    if (location.pathname.includes("/photo")) return "digital";
    if (location.pathname.includes("/video")) return "digital";
    if (location.pathname.includes("/physical")) return "physical";
    return "all";
  }, [paramType, location.pathname]);

  const [products, setProducts] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [collection, setCollection] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [isGridHovered, setIsGridHovered] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getGalleryProducts(
          type,
          collection,
          searchTerm,
          sortOrder,
        );

        // Handle both paginated (response.results) and non-paginated (array) formats
        const scrubDigitalPricing = (items: GalleryItem[]) =>
          items.map((item) =>
            item.product_type === "physical"
                ? item
                : {
                    ...item,
                    price: "",
                    price_hd: undefined,
                    price_4k: undefined,
                    starting_price: undefined,
                  },
          );

        if (Array.isArray(response)) {
          setProducts(scrubDigitalPricing(response));
        } else if (response && response.results) {
          setProducts(scrubDigitalPricing(response.results));
        } else {
          // Fallback for empty or unexpected structure
          setProducts([]);
        }
      } catch (err) {
        console.error("Gallery Error:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, collection, searchTerm, sortOrder]);

  return (
    // Dark mode background for the gallery canvas
    <div className="bg-black min-h-screen pb-20">
      {/* 1. 3D SWIPER HERO (Controls Collection State) */}
      <VisualCategoryHero
        activeCollection={collection}
        onSelectCollection={setCollection}
        isPaused={isGridHovered || isAnyModalOpen}
      />

      {/* 2. MINIMAL TOOLBAR (Search & Sort) */}
      <MinimalToolbar onSearch={setSearchTerm} onSortChange={setSortOrder} />

      <div
        className="container mx-auto px-4 lg:px-8 relative z-10"
        onMouseEnter={() => setIsGridHovered(true)}
        onMouseLeave={() => setIsGridHovered(false)}
      >
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && !error && products.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid flex w-auto -ml-8"
            columnClassName="my-masonry-grid_column pl-8 bg-clip-padding"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="mb-8"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <ProductCard
                  product={product}
                  onModalOpen={() => setIsAnyModalOpen(true)}
                  onModalClose={() => setIsAnyModalOpen(false)}
                />
              </div>
            ))}
          </Masonry>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
