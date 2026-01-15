import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GalleryItem } from "../services/api";
import { useCart } from "../context/CartContext";
import QuickAddModal from "./QuickAddModal";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: GalleryItem;
  contextType?: "digital" | "physical" | "all";
}

// Define the backend base URL
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const ProductCard: React.FC<ProductCardProps> = ({ product, contextType }) => {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  // --- SMART ROUTING LOGIC (Preserved) ---
  let detailUrl = "";
  if (product.product_type === "video") {
    detailUrl = `/gallery/video/${product.id}`;
  } else if (contextType === "digital") {
    detailUrl = `/gallery/photo/${product.id}`;
  } else if (contextType === "physical") {
    detailUrl = `/gallery/physical/${product.id}`;
  } else if (product.product_type === "physical") {
    detailUrl = `/gallery/physical/${product.id}`;
  } else {
    detailUrl = `/gallery/photo/${product.id}`;
  }

  // --- IMAGE LOGIC ---
  const rawImageUrl = product.preview_image || product.thumbnail_image;
  const imageUrl = rawImageUrl
    ? `${BACKEND_BASE_URL}${rawImageUrl}`
    : "https://via.placeholder.com/400x300";

  // --- PRICE LOGIC ---
  const showDigitalPrice =
    contextType === "digital" ||
    (!contextType && product.product_type !== "physical");

  const displayPrice = showDigitalPrice
    ? product.price_hd || product.price || "0.00"
    : product.starting_price || product.price || "0.00";

  const isPhysicalDisplay = !showDigitalPrice;
  const isVideo = product.product_type === "video";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isVideo) {
      const productToAdd = {
        ...product,
        price: product.price_hd || "0.00", // Use HD price
      };

      const options = {
        license: "hd",
        type: "digital",
      };

      addToCart(productToAdd, 1, options);
      toast.success("HD Video added to bag!");
    }
    // 2. DIGITAL PHOTOS (Context is 'digital' or 'all' but type is photo)
    else if (contextType === "digital") {
      // Instant add for Digital Photo (Default to HD License)
      const productToAdd = {
        ...product,
        price: product.price_hd || product.price, // Fallback
      };

      // Force type: 'photo' so backend treats it as digital
      addToCart(productToAdd, 1, {
        license: "hd",
        type: "photo",
      });
      toast.success("Digital Photo (HD) added to bag!");
    }
    // 3. PHYSICAL PRINTS (Default behavior)
    else {
      // Open Modal for Prints (to pick Size/Material)
      setShowQuickView(true);
    }
  };

  return (
    <>
      <Link
        to={detailUrl}
        className="group block overflow-hidden rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative"
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-600 hover:text-white z-20"
            title="Quick Add to Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        {/* Details Section */}
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

      {showQuickView && (
        <QuickAddModal
          productId={product.id}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
