import React from "react";
import { Link } from "react-router-dom";
import { GalleryItem } from "../services/api";

interface ProductCardProps {
  product: GalleryItem;
  contextType?: "digital" | "physical" | "all";
}

// Define the backend base URL
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const ProductCard: React.FC<ProductCardProps> = ({ product, contextType }) => {
  // 1. SMART ROUTING LOGIC
  let detailUrl = "";

  // VIDEO: Always goes to video route
  if (product.product_type === "video") {
    detailUrl = `/gallery/video/${product.id}`;
  }
  // CONTEXT OVERRIDE: If we are explicitly in the Digital Gallery, force the Photo URL
  else if (contextType === "digital") {
    detailUrl = `/gallery/photo/${product.id}`;
  }
  // CONTEXT OVERRIDE: If we are explicitly in the Physical Gallery, force the Physical URL
  else if (contextType === "physical") {
    detailUrl = `/gallery/physical/${product.id}`;
  }
  // DEFAULT: Fallback to the product's own type
  else if (product.product_type === "physical") {
    detailUrl = `/gallery/physical/${product.id}`;
  } else {
    detailUrl = `/gallery/photo/${product.id}`;
  }

  // 2. IMAGE LOGIC
  const rawImageUrl = product.preview_image || product.thumbnail_image;
  const imageUrl = rawImageUrl
    ? `${BACKEND_BASE_URL}${rawImageUrl}`
    : "https://via.placeholder.com/400x300";

  // 3. PRICE LOGIC
  // If we are in Digital Mode, show the Digital Price, otherwise default to Physical/Starting
  const showDigitalPrice =
    contextType === "digital" ||
    (!contextType && product.product_type !== "physical");

  const displayPrice = showDigitalPrice
    ? product.price_hd || product.price || "0.00"
    : product.starting_price || product.price || "0.00";

  const isPhysicalDisplay = !showDigitalPrice;

  return (
    <Link
      to={detailUrl}
      className="group block overflow-hidden rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-bold uppercase tracking-wider text-white rounded shadow-sm ${
              isPhysicalDisplay ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {isPhysicalDisplay ? "Print" : "Digital"}
          </span>
        </div>
      </div>

      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate font-sans">
          {product.title}
        </h3>
        <p className="text-gray-600 font-medium mt-1 font-serif">
          {isPhysicalDisplay ? "From " : "License: "}
          <span
            className={isPhysicalDisplay ? "text-green-700" : "text-blue-700"}
          >
            €{displayPrice}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
