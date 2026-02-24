import React from "react";
import { OrderHistory } from "../services/api";
import { Link } from "react-router-dom";

interface OrderHistoryCardProps {
  order: OrderHistory;
}

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order }) => {
  const orderDate = new Date(order.date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasDigitalItems = order.items.some(
    (item) => item.product.product_type !== "physical",
  );

  return (
    <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-sm hover:border-white/20 transition-colors">
      {/* HEADER */}
      <div className="bg-white/5 p-4 flex flex-wrap gap-6 justify-between items-center border-b border-white/5">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Order #
            </p>
            <p className="text-white font-mono">{order.order_number}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Date
            </p>
            <p className="text-white">{orderDate}</p>
          </div>

          {/* 👇 NEW: SHIPPING DETAILS DISPLAY 👇 */}
          {Number(order.delivery_cost) > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Shipping (
                {order.shipping_method
                  ? order.shipping_method.charAt(0).toUpperCase() +
                    order.shipping_method.slice(1)
                  : "Standard"}
                )
              </p>
              <p className="text-white">
                €{Number(order.delivery_cost).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">
            Total
          </p>
          {hasDigitalItems ? (
            <p className="text-gray-400 font-bold text-sm">
              Licensing handled separately
            </p>
          ) : (
            <p className="text-accent font-bold text-lg">
              €{Number(order.total_price).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="p-4 divide-y divide-white/5">
        {order.items.map((item) => {
          const rawImageUrl =
            item.product.preview_image || item.product.thumbnail_image;
          const imageUrl = rawImageUrl?.startsWith("http")
            ? rawImageUrl
            : `${BACKEND_BASE_URL}${rawImageUrl}`;
          const productPath =
            item.product.product_type === "video"
              ? "video"
              : item.product.product_type === "physical"
                ? "physical"
                : "photo";
          const productId =
            item.product.product_type === "physical"
              ? item.product.id
              : item.product.photo_id || item.product.id;

          return (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <Link
                // 👇 Use photo_id for digital items when available
                to={`/gallery/${productPath}/${productId}`}
                className="block flex-shrink-0 w-16 h-16 bg-gray-800 rounded overflow-hidden border border-white/10"
              >
                <img
                  src={imageUrl}
                  alt={item.product.title}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">
                  {item.product.title}
                </h4>

                {/* 👇 FIX: Show the actual material and size instead of generic text */}
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {item.product.product_type === "physical"
                    ? `${item.product.material_display} (${item.product.size_display})`
                    : "Licensed Asset"}
                </p>
              </div>

              <div className="text-right">
                {item.product.product_type === "physical" ? (
                  <p className="text-white font-bold">
                    €{Number(item.item_total).toFixed(2)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm font-bold">Licensed</p>
                )}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistoryCard;
