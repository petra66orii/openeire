import React from "react";
import { Link } from "react-router-dom";
import { GalleryItem } from "../services/api";

interface ProductCardProps {
  product: GalleryItem;
}

// Define the backend base URL
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Determine the correct link and image source based on product type
  const detailUrl = `/gallery/${product.product_type}/${product.id}`;
  // Conditionally create the full URL for the image
  let rawImageUrl = product.preview_image || product.thumbnail_image;
  const imageUrl = rawImageUrl
    ? `${BACKEND_BASE_URL}${rawImageUrl}`
    : "https://via.placeholder.com/400x300";
  const displayPrice = product.price || product.price_hd;

  return (
    <Link
      to={detailUrl}
      className="group block overflow-hidden rounded-lg shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h3>
        <p className="mt-1 text-md font-medium text-gray-600">
          €{displayPrice}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
