import React from "react";
import { useCart, CartItem } from "../context/CartContext";

interface BagItemProps {
  item: CartItem;
}

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BagItem: React.FC<BagItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const rawImageUrl =
    item.product.preview_image || item.product.thumbnail_image;
  const imageUrl = rawImageUrl?.startsWith("http")
    ? rawImageUrl
    : rawImageUrl
    ? `${BACKEND_BASE_URL}${rawImageUrl}`
    : "https://via.placeholder.com/80x80?text=No+Image";
  const price = parseFloat(item.product.price || item.product.price_hd || "0");

  return (
    <div className="flex items-center py-4 border-b">
      <img
        src={imageUrl}
        alt={item.product.title}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-grow ml-4">
        <h3 className="font-semibold">{item.product.title}</h3>
        <p className="text-sm text-gray-500">€{price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 p-2 border rounded-md"
        />
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BagItem;
