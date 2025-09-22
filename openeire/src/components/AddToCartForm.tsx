import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductDetailItem } from "../services/api";
import { toast } from "react-toastify";

interface AddToCartFormProps {
  product: ProductDetailItem;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart(product, quantity);
    toast.success(`${product.title} was added to your bag!`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Purchase Options
      </h2>

      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="font-semibold">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="w-20 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 px-4 py-3 text-lg font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
      >
        Add to Bag
      </button>
    </form>
  );
};

export default AddToCartForm;
