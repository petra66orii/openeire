// src/components/OrderHistoryList.tsx

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistory } from "../services/api";
import OrderHistoryCard from "./OrderHistoryCard";

const OrderHistoryList: React.FC = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["orderHistory"], queryFn: getOrderHistory });

  if (isLoading) {
    return (
      <div className="mt-6 border-t pt-6 text-center text-gray-500">
        Loading order history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 border-t pt-6 text-center text-red-500">
        Failed to load order history. Please try again later.
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-6 border-t pt-6 text-center text-gray-500">
        You have not placed any orders yet.
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
      <div>
        {orders.map((order) => (
          <OrderHistoryCard key={order.order_number} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryList;
