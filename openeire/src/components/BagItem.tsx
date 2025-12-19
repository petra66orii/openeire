import React from "react";
import { useCart, CartItem } from "../context/CartContext";

interface BagItemProps {
  item: CartItem;
}

// Ensure this matches your Django server port
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BagItem: React.FC<BagItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // 1. Image Logic
  // We prioritize preview_image because we set that explicitly in ProductDetailPage logic
  const rawImageUrl =
    item.product.preview_image || item.product.thumbnail_image;

  const imageUrl = rawImageUrl?.startsWith("http")
    ? rawImageUrl
    : rawImageUrl
    ? `${BACKEND_BASE_URL}${rawImageUrl}`
    : "https://via.placeholder.com/150?text=No+Image";

  // 2. Price Logic
  // Prioritize 'price' because our physical logic sets that field on the synthesized object
  const price = parseFloat(item.product.price || item.product.price_hd || "0");

  return (
    <div className="flex items-center py-6 border-b border-gray-100 last:border-0">
      {/* IMAGE */}
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={item.product.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-grow ml-6">
        <h3 className="text-lg font-medium text-gray-900">
          {item.product.title}
        </h3>

        {/* Optional: Explicitly show License for Digital items if not in title */}
        {item.options?.license && (
          <p className="text-sm text-gray-500 uppercase mt-1">
            License: {item.options.license}
          </p>
        )}

        <p className="text-green-600 font-bold mt-1">€{price.toFixed(2)}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              updateQuantity(item.cartId, parseInt(e.target.value))
            }
            className="w-12 text-center p-1 border-x border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
          >
            +
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.cartId)}
          className="text-sm text-red-500 hover:text-red-700 underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BagItem;
