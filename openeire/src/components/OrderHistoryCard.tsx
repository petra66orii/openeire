import React, { useState } from "react";
import toast from "react-hot-toast";
import { OrderHistory, downloadProduct } from "../services/api";
import { getDownloadToastErrorMessage } from "../utils/toast";
import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../config/backend";

interface OrderHistoryCardProps {
  order: OrderHistory;
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order }) => {
  const [downloadingItemId, setDownloadingItemId] = useState<number | null>(null);
  const orderDate = new Date(order.date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = async (
    orderItemId: number,
    productId: number,
    type: "photo" | "video",
    fallbackFilename: string,
  ) => {
    setDownloadingItemId(orderItemId);
    try {
      await downloadProduct(type, productId, fallbackFilename);
      toast.success("Download started.");
    } catch (error) {
      console.error(error);
      toast.error(getDownloadToastErrorMessage(error));
    } finally {
      setDownloadingItemId(null);
    }
  };

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

          {/* Shipping details display */}
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
                {"\u20AC"}{Number(order.delivery_cost).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right">
            Total
          </p>
          <p className="text-accent font-bold text-lg">
            {"\u20AC"}{Number(order.total_price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="p-4 divide-y divide-white/5">
        {order.items.map((item) => {
          const rawImageUrl =
            item.product.preview_image || item.product.thumbnail_image;
          const imageUrl =
            resolveMediaUrl(rawImageUrl) || "https://via.placeholder.com/150?text=No+Image";
          const productPath =
            item.product.product_type === "video"
              ? "video"
              : item.product.product_type === "physical"
                ? "physical"
                : "photo";
          const productId = item.product.photo_id || item.product.id;
          const isDigitalItem =
            item.product.product_type === "photo" ||
            item.product.product_type === "video";
          const digitalType: "photo" | "video" | null =
            item.product.product_type === "video"
              ? "video"
              : item.product.product_type === "photo"
                ? "photo"
                : null;

          return (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <Link
                // Use photo_id for digital items when available
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

                {/* Show material and size for physical items */}
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {item.product.product_type === "physical"
                    ? `${item.product.material_display} (${item.product.size_display})`
                    : "Personal Download"}
                </p>
                {isDigitalItem && item.personal_terms_version && (
                  <p className="text-xs text-gray-500">
                    {item.personal_terms_version}
                  </p>
                )}
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-white font-bold">
                  {"\u20AC"}{Number(item.item_total).toFixed(2)}
                </p>
                {digitalType ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        item.id,
                        productId,
                        digitalType,
                        `${item.product.title}.${digitalType === "video" ? "mp4" : "jpg"}`,
                      )
                    }
                    disabled={downloadingItemId === item.id}
                    className="inline-flex items-center rounded-full border border-accent/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingItemId === item.id ? "Preparing..." : "Download"}
                  </button>
                ) : null}
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



