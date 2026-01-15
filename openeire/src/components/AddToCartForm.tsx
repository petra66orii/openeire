import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { GalleryItem } from "../services/api";

interface AddToCartFormProps {
  product: GalleryItem;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Detect if this is a forced digital product
    const isVideo = product.product_type === "video";
    const isPhoto = product.product_type === "photo";
    const isDigital = isVideo || isPhoto;

    // 2. Define Options
    let options: any = {};

    if (isDigital) {
      // Force the cart to see this as digital
      options.type = product.product_type;

      // Add License details
      if (product.title.includes("4K")) {
        options.license = "4k";
      } else {
        options.license = "hd";
      }
      options.details = `${options.license.toUpperCase()} License`;
    } else {
      // Physical Fallback
      options.type = "physical";
    }

    // 3. Add to Cart
    addToCart(product, quantity, options);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      {/* Quantity Selector */}
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-1 hover:bg-gray-100 text-gray-600"
        >
          -
        </button>
        <span className="px-3 py-1 text-gray-800 font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-1 hover:bg-gray-100 text-gray-600"
        >
          +
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`flex-1 px-6 py-2 rounded-md font-bold text-white transition-all shadow-md
          ${
            added ? "bg-green-700 scale-95" : "bg-green-600 hover:bg-green-700"
          }`}
      >
        {added ? "Added!" : "Add to Bag"}
      </button>
    </form>
  );
};

export default AddToCartForm;
