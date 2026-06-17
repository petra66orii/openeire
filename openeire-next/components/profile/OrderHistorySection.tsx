"use client";

import { useEffect, useState } from "react";
import { FaBoxOpen, FaReceipt, FaShippingFast } from "react-icons/fa";
import { getOrderHistory } from "@/lib/api/orders";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import type { OrderHistory, OrderHistoryItem } from "@/types/orders";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("en-IE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatCurrency = (value?: string | number | null) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return currencyFormatter.format(0);
  return currencyFormatter.format(amount);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return dateFormatter.format(date);
};

const formatShippingMethod = (method?: string | null) => {
  const trimmed = method?.trim();
  if (!trimmed) return "Not applicable";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const isDigitalOnlyOrder = (items: OrderHistoryItem[]) =>
  items.length > 0 &&
  items.every((item) =>
    item.product?.product_type === "photo" ||
    item.product?.product_type === "video",
  );

const getProductTitle = (item: OrderHistoryItem) =>
  item.product?.title?.trim() || "Purchased item";

const getProductMeta = (item: OrderHistoryItem) => {
  if (!item.product) return "Item details unavailable";
  if (item.product.product_type === "physical") {
    return [item.product.material_display, item.product.size_display]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" / ") || "Physical art print";
  }
  if (item.product.product_type === "video") return "Personal video licence";
  if (item.product.product_type === "photo") return "Personal photo licence";
  return "Purchased item";
};

function LoadingState() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="h-8 w-48 rounded bg-white/10" />
      {[0, 1].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-white/10 bg-black/30 p-6"
        >
          <div className="mb-6 h-5 w-3/4 rounded bg-white/10" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="h-12 rounded bg-white/10" />
            <div className="h-12 rounded bg-white/10" />
            <div className="h-12 rounded bg-white/10" />
            <div className="h-12 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-16 text-center">
      <FaBoxOpen className="mx-auto mb-4 text-4xl text-gray-700" />
      <h3 className="font-serif text-2xl font-bold text-white">
        No orders yet
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        Your art print and digital purchases will appear here once an order has
        been completed.
      </p>
    </div>
  );
}

function OrderItemRow({ item }: { item: OrderHistoryItem }) {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="line-clamp-2 font-bold text-white">
          {getProductTitle(item)}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
          {getProductMeta(item)}
        </p>
        {item.personal_terms_version ? (
          <p className="mt-1 text-xs text-gray-500">
            {item.personal_terms_version}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 sm:min-w-32 sm:flex-col sm:items-end sm:text-right">
        <p className="font-bold text-white">{formatCurrency(item.item_total)}</p>
        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
      </div>
    </li>
  );
}

function OrderCard({ order }: { order: OrderHistory }) {
  const shippingLabel = isDigitalOnlyOrder(order.items)
    ? "Digital delivery"
    : formatShippingMethod(order.shipping_method);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-sm transition-colors hover:border-white/20">
      <div className="border-b border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <FaReceipt aria-hidden="true" />
              Order reference
            </p>
            <p className="break-all font-mono text-sm text-white">
              {order.order_number}
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Total
            </p>
            <p className="mt-1 text-xl font-bold text-accent">
              {formatCurrency(order.total_price)}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Date
            </dt>
            <dd className="mt-1 text-sm text-white">{formatDate(order.date)}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Status
            </dt>
            <dd className="mt-1 text-sm text-white">Order confirmed</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Shipping
            </dt>
            <dd className="mt-1 text-sm text-white">
              {shippingLabel}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <FaShippingFast aria-hidden="true" />
              Delivery
            </dt>
            <dd className="mt-1 text-sm text-white">
              {Number(order.delivery_cost ?? 0) > 0
                ? formatCurrency(order.delivery_cost)
                : "No delivery charge"}
            </dd>
          </div>
        </dl>
        {Number(order.discount_amount ?? 0) > 0 ? (
          <p className="mt-4 rounded-lg border border-brand-500/20 bg-brand-500/10 px-3 py-2 text-xs text-brand-100">
            {order.discount_label || order.discount_code || "Discount"} saved{" "}
            {formatCurrency(order.discount_amount)}.
          </p>
        ) : null}
      </div>

      <div className="p-5">
        <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-500">
          Items purchased
        </h4>
        <ul className="divide-y divide-white/10">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </article>
  );
}

export function OrderHistorySection() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getOrderHistory()
      .then((results) => {
        if (isMounted) setOrders(results);
      })
      .catch((caughtError) => {
        if (isMounted) {
          setError(
            normalizeAuthErrorMessage(
              caughtError,
              "Could not load your order history.",
            ),
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <section aria-labelledby="orders-heading">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h3
          id="orders-heading"
          className="font-serif text-3xl font-bold text-white"
        >
          Order History
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          A read-only record of your completed OpenÉire Studios purchases.
          Downloads and licence actions will be added in a later account-area
          migration.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.order_number} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
