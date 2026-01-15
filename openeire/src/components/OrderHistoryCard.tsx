import React from "react";
import { OrderHistory } from "../services/api";
import DownloadButton from "./DownloadButton";

interface OrderHistoryCardProps {
  order: OrderHistory;
}

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order }) => {
  const orderDate = new Date(order.date).toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Card Header */}
      <div className="flex flex-col gap-2 rounded-t-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div>
            <p className="text-xs font-medium text-gray-500">Order Number</p>
            <p className="font-semibold text-gray-800">{order.order_number}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Date Placed</p>
            <p className="font-semibold text-gray-800">{orderDate}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Total Price</p>
          <p className="font-semibold text-gray-800">€{order.total_price}</p>
        </div>
      </div>

      {/* Card Body - List of Items */}
      <div className="divide-y divide-gray-200 p-4">
        {order.items.map((item) => {
          const rawImageUrl =
            item.product.preview_image || item.product.thumbnail_image;
          const imageUrl = rawImageUrl?.startsWith("http")
            ? rawImageUrl
            : rawImageUrl
            ? `${BACKEND_BASE_URL}${rawImageUrl}`
            : "https://placehold.co/80x80/e2e8f0/94a3b8?text=No+Image";

          return (
            <div key={item.id} className="flex gap-4 py-4">
              <img
                src={imageUrl}
                alt={item.product.title}
                className="h-16 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {item.product.title}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {item.product.product_type}
                </p>
                {/* Only show for Digital Items */}
                {(item.product.product_type === "photo" ||
                  item.product.product_type === "video") && (
                  <DownloadButton
                    productType={item.product.product_type}
                    productId={item.product.id}
                    fileName={`${item.product.title}.${
                      item.product.product_type === "video" ? "mp4" : "jpg"
                    }`}
                  />
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  €{item.item_total}
                </p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistoryCard;
