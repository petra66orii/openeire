import React from "react";
import { useCart, CartItem } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

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
      : "https://via.placeholder.com/150?text=No+Image";

  const price = parseFloat(item.product.price || item.product.price_hd || "0");
  const isDigital =
    item.product.product_type !== "physical" &&
    item.options?.type !== "physical";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-8 border-b border-white/5 last:border-0 group transition-colors -mx-4 px-4 md:mx-0 md:px-0 rounded-lg">
      {/* IMAGE */}
      <Link
        to={`/gallery/${isDigital ? "photo" : "physical"}/${item.product.id}`}
        className="flex-shrink-0 w-24 h-32 md:w-32 md:h-24 bg-black rounded-lg overflow-hidden border border-white/10 relative"
      >
        <img
          src={imageUrl}
          alt={item.product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
      </Link>

      {/* DETAILS */}
      <div className="flex-grow mt-4 md:mt-0 md:ml-8 w-full">
        <div className="flex justify-between items-start">
          <div>
            <Link
              to={`/gallery/${isDigital ? "photo" : "physical"}/${item.product.id}`}
              className="text-xl font-serif font-bold text-white hover:text-brand-500 transition-colors"
            >
              {item.product.title}
            </Link>

            <div className="mt-2 space-y-1">
              {/* License / Type Badge */}
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                {isDigital
                  ? item.options?.license === "4k"
                    ? "Commercial License (4K)"
                    : "Standard License (HD)"
                  : "Fine Art Print"}
              </p>

              {/* Physical Details */}
              {!isDigital && item.product.title.includes("(") && (
                <p className="text-sm text-gray-400">
                  {item.product.title.split("(")[1].replace(")", "")}
                </p>
              )}
            </div>
          </div>

          <p className="text-xl font-serif font-bold text-white">
            €{(price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between items-end mt-4">
          {/* Quantity */}
          <div className="flex items-center bg-black border border-white/20 rounded-lg h-9">
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
              className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <FaMinus className="text-[10px]" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
              className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.cartId)}
            className="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <FaTrash className="mb-0.5" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagItem;
