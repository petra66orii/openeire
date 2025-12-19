import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { GalleryItem } from "../services/api";

interface AddToCartFormProps {
  product: GalleryItem; // This accepts the 'synthesized' product from the detail page
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Extract Options from the 'synthesized' product if available

    // For Digital Licenses, we might want to be explicit:
    let options = {};
    if (product.title.includes("HD")) options = { license: "hd" };
    if (product.title.includes("4K")) options = { license: "4k" };

    // Pass to Context
    addToCart(product, quantity, options);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
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

      <button
        type="submit"
        className={`flex-1 px-6 py-2 rounded-md font-bold text-white transition-all shadow-md
          ${
            added ? "bg-green-700 scale-95" : "bg-green-600 hover:bg-green-700"
          }`}
      >
        {added ? "Added!" : "Add to Cart"}
      </button>
    </form>
  );
};

export default AddToCartForm;
