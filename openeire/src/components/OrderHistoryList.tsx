import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistory } from "../services/api";
import OrderHistoryCard from "./OrderHistoryCard";
import { FaBoxOpen } from "react-icons/fa";

const OrderHistoryList: React.FC = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["orderHistory"], queryFn: getOrderHistory });

  if (isLoading)
    return <div className="text-gray-500 italic">Loading order history...</div>;
  if (isError)
    return <div className="text-red-500">Failed to load orders.</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20 bg-black/20 rounded-2xl border border-white/5">
        <FaBoxOpen className="mx-auto text-4xl text-gray-700 mb-4" />
        <h3 className="text-xl font-bold text-white">No orders yet</h3>
        <p className="text-gray-500">Your purchases will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        Order History
      </h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderHistoryCard key={order.order_number} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryList;
