import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import BagItem from "../components/BagItem";
import OrderSummary from "../components/OrderSummary";

const ShoppingBagPage: React.FC = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Your Shopping Bag is Empty</h1>
        <Link to="/gallery" className="text-green-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <BagItem key={item.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default ShoppingBagPage;
