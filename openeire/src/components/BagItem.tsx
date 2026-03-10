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

  const isPhysical = item.product.product_type === "physical";
  const isDigital =
    item.product.product_type === "photo" || item.product.product_type === "video";

  const detailLink = isPhysical
    ? `/gallery/physical/${item.options?.sourceProductId ?? item.productId}`
    : `/gallery/${item.product.product_type}/${item.productId}`;

  const rawImageUrl = item.product.preview_image || item.product.thumbnail_image;
  const imageUrl = rawImageUrl?.startsWith("http")
    ? rawImageUrl
    : rawImageUrl
      ? `${BACKEND_BASE_URL}${rawImageUrl}`
      : "https://via.placeholder.com/150?text=No+Image";

  const parsedOptionPrice = parseFloat(String(item.options?.unitPrice ?? ""));
  const unitPrice = Number.isFinite(parsedOptionPrice)
    ? parsedOptionPrice
    : parseFloat(item.product.price || "0");
  const licenseLabel =
    item.options?.license === "4k"
      ? "4K Personal Licence"
      : "HD Personal Licence";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-8 border-b border-white/5 last:border-0 group transition-colors -mx-4 px-4 md:mx-0 md:px-0 rounded-lg">
      <Link
        to={detailLink}
        className="flex-shrink-0 w-24 h-32 md:w-32 md:h-24 bg-black rounded-lg overflow-hidden border border-white/10 relative"
      >
        <img
          src={imageUrl}
          alt={item.product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
      </Link>

      <div className="flex-grow mt-4 md:mt-0 md:ml-8 w-full">
        <div className="flex justify-between items-start">
          <div>
            <Link
              to={detailLink}
              className="text-xl font-serif font-bold text-white hover:text-brand-500 transition-colors"
            >
              {item.product.title}
            </Link>

            <div className="mt-2 space-y-1">
              {isPhysical ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    Fine Art Print
                  </p>
                  {item.product.title.includes("(") && (
                    <p className="text-sm text-gray-400">
                      {item.product.title.split("(")[1].replace(")", "")}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    {item.product.product_type === "video"
                      ? "Digital Video"
                      : "Digital Photo"}
                  </p>
                  {isDigital && (
                    <p className="text-sm text-gray-400">{licenseLabel}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <p className="text-xl font-serif font-bold text-white">
            €{(unitPrice * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between items-end mt-4">
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
