import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getGalleryProducts, GalleryItem } from "../services/api";
import ProductCard from "../components/ProductCard";
import CollectionFilter from "../components/CollectionFilter";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";

// Define the allowed type for cleaner usage
type GalleryType = "digital" | "physical" | "all";

const GalleryPage: React.FC = () => {
  const { type: paramType } = useParams<{ type?: string }>();
  const location = useLocation();

  const type: GalleryType = useMemo(() => {
    // 1. Check if the URL param is exactly one of the allowed types
    if (
      paramType === "digital" ||
      paramType === "physical" ||
      paramType === "all"
    ) {
      return paramType;
    }
    // 2. Fallback: Check the path
    if (location.pathname.includes("/digital")) return "digital";
    if (location.pathname.includes("/photo")) return "digital";
    if (location.pathname.includes("/video")) return "digital";
    if (location.pathname.includes("/physical")) return "physical";

    // 3. Default
    return "all";
  }, [paramType, location.pathname]);

  const [products, setProducts] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [collection, setCollection] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("date_desc");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getGalleryProducts(
          type,
          collection,
          searchTerm,
          sortOrder
        );
        setProducts(response.results);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, collection, searchTerm, sortOrder]);

  const title =
    type === "digital"
      ? "Digital Stock Footage"
      : type === "physical"
      ? "Physical Art Prints"
      : "All Products";

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800 font-sans">
          {title}
        </h1>

        {/* Controls Grid */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center max-w-4xl mx-auto">
          <div className="w-full md:w-1/3">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="w-full md:w-auto overflow-x-auto">
            <CollectionFilter
              activeCollection={collection}
              onSelectCollection={setCollection}
            />
          </div>
          <div className="w-full md:w-auto">
            <SortDropdown onSortChange={setSortOrder} />
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
          {products.map((product) => (
            <ProductCard
              key={`${product.product_type}-${product.id}`}
              product={product}
              contextType={type}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No products found.</p>
          <button
            onClick={() => {
              setCollection("all");
              setSearchTerm("");
            }}
            className="mt-4 text-green-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
