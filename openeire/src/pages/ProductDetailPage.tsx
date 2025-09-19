// src/pages/ProductDetailPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductDetail, ProductDetailItem } from "../services/api";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const ProductDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;

    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductDetail(type, id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [type, id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center mt-10">Product not found.</div>;

  // Determine image URL based on product type
  let imageUrl = "";
  if (product.product_type === "physical" && "photo" in product) {
    imageUrl = `${product.photo.preview_image}`;
  } else if (product.product_type === "photo") {
    imageUrl = `${product.preview_image}`;
  } else if (product.product_type === "video") {
    imageUrl = `${product.thumbnail_image}`;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <Link
          to={`/gallery/${type === "physical" ? "physical" : "digital"}`}
          className="text-green-600 hover:underline"
        >
          &larr; Back to Gallery
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image/Video Column */}
        <div>
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Details Column */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>

          {"description" in product && (
            <p className="text-gray-600 text-lg">{product.description}</p>
          )}

          <div className="pt-4 border-t">
            {/* We will replace this with a real AddToCartForm later */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800">
                Purchase Options
              </h2>
              <p className="mt-2 text-gray-500">
                Add to cart form will go here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
