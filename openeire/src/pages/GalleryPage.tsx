import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGalleryProducts, GalleryItem } from "../services/api";
import ProductCard from "../components/ProductCard";

const GalleryPage: React.FC = () => {
  const { type = "all" } = useParams<{
    type: "digital" | "physical" | "all";
  }>();
  const [products, setProducts] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getGalleryProducts(type);
        setProducts(response.results);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]); // Refetch whenever the 'type' in the URL changes

  const title =
    type === "digital"
      ? "Digital Stock Footage"
      : type === "physical"
      ? "Physical Art Prints"
      : "All Products";

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-800 border-b pb-4">
        {title}
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={`${product.product_type}-${product.id}`}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
