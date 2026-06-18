"use client";

import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaFilePdf, FaFolderOpen } from "react-icons/fa";
import { getOrderHistory } from "@/lib/api/orders";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import type { OrderHistory, OrderHistoryItem } from "@/types/orders";

type EntitlementMode = "downloads" | "licences";

interface DigitalDownloadEntry {
  id: string;
  title: string;
  meta: string;
  orderNumber: string;
  date: string;
  url: string | null;
}

interface PersonalLicenceEntry {
  id: string;
  title: string;
  itemSummary: string;
  orderNumber: string;
  date: string;
  version: string | null;
  url: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("en-IE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const isDigitalItem = (item: OrderHistoryItem) =>
  item.product?.product_type === "photo" || item.product?.product_type === "video";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return dateFormatter.format(date);
};

const getProductTitle = (item: OrderHistoryItem) =>
  item.product?.title?.trim() || "Purchased digital asset";

const getProductMeta = (item: OrderHistoryItem) => {
  if (item.product?.product_type === "video") return "Personal video licence";
  if (item.product?.product_type === "photo") return "Personal photo licence";
  return "Personal digital licence";
};

const openOneTimeUrl = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "nofollow noopener noreferrer";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    link.remove();
  }, 0);
};

const buildDownloadEntries = (orders: OrderHistory[]): DigitalDownloadEntry[] =>
  orders.flatMap((order) =>
    order.items.filter(isDigitalItem).map((item) => ({
      id: `${order.order_number}-${item.id}`,
      title: getProductTitle(item),
      meta: getProductMeta(item),
      orderNumber: order.order_number,
      date: formatDate(order.date),
      url: item.download_url ?? null,
    })),
  );

const buildLicenceEntries = (orders: OrderHistory[]): PersonalLicenceEntry[] =>
  orders
    .map((order) => {
      const digitalItems = order.items.filter(isDigitalItem);
      if (digitalItems.length === 0) return null;

      const licenceUrl =
        digitalItems.find((item) => item.personal_terms_url)?.personal_terms_url ??
        null;
      const version =
        digitalItems.find((item) => item.personal_terms_version)
          ?.personal_terms_version ??
        order.personal_terms_version ??
        null;
      const titles = digitalItems.map(getProductTitle);

      return {
        id: order.order_number,
        title: `Personal licence for order ${order.order_number}`,
        itemSummary:
          titles.length === 1
            ? titles[0]
            : `${titles.length} digital assets`,
        orderNumber: order.order_number,
        date: formatDate(order.date),
        version,
        url: licenceUrl,
      };
    })
    .filter((entry): entry is PersonalLicenceEntry => Boolean(entry));

function LoadingState({ mode }: { mode: EntitlementMode }) {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="h-8 w-56 rounded bg-white/10" />
      {[0, 1].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-white/10 bg-black/30 p-6"
        >
          <div className="mb-4 h-5 w-2/3 rounded bg-white/10" />
          <div className="h-4 w-1/3 rounded bg-white/10" />
        </div>
      ))}
      <span className="sr-only">
        Loading {mode === "downloads" ? "downloads" : "licences"}
      </span>
    </div>
  );
}

function EmptyState({ mode }: { mode: EntitlementMode }) {
  const isDownloads = mode === "downloads";
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-16 text-center">
      <FaFolderOpen className="mx-auto mb-4 text-4xl text-gray-700" />
      <h3 className="font-serif text-2xl font-bold text-white">
        {isDownloads ? "No digital downloads yet" : "No personal licences yet"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {isDownloads
          ? "Purchased photo and video downloads will appear here after checkout."
          : "Personal licence PDFs will appear here for purchased digital assets."}
      </p>
    </div>
  );
}

function ActionButton({
  url,
  label,
  unavailableLabel,
}: {
  url: string | null;
  label: string;
  unavailableLabel: string;
}) {
  if (!url) {
    return (
      <span className="inline-flex rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {unavailableLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openOneTimeUrl(url)}
      className="inline-flex rounded-full border border-accent/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
    >
      {label}
    </button>
  );
}

function DownloadCard({ entry }: { entry: DigitalDownloadEntry }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black p-5 transition-colors hover:border-white/20">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <FaDownload aria-hidden="true" />
            Digital download
          </p>
          <h4 className="line-clamp-2 font-bold text-white">{entry.title}</h4>
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
            {entry.meta}
          </p>
          <p className="mt-3 break-all text-xs text-gray-500">
            Order {entry.orderNumber} · {entry.date}
          </p>
        </div>
        <div className="shrink-0">
          <ActionButton
            url={entry.url}
            label="Download asset"
            unavailableLabel="Download unavailable"
          />
        </div>
      </div>
    </article>
  );
}

function LicenceCard({ entry }: { entry: PersonalLicenceEntry }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black p-5 transition-colors hover:border-white/20">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <FaFilePdf aria-hidden="true" />
            Personal licence
          </p>
          <h4 className="line-clamp-2 font-bold text-white">{entry.title}</h4>
          <p className="mt-1 text-sm text-gray-400">{entry.itemSummary}</p>
          {entry.version ? (
            <p className="mt-1 text-xs text-gray-500">{entry.version}</p>
          ) : null}
          <p className="mt-3 break-all text-xs text-gray-500">
            Order {entry.orderNumber} · {entry.date}
          </p>
        </div>
        <div className="shrink-0">
          <ActionButton
            url={entry.url}
            label="Download personal licence"
            unavailableLabel="Licence unavailable"
          />
        </div>
      </div>
    </article>
  );
}

export function DigitalEntitlementsSection({
  mode,
}: {
  mode: EntitlementMode;
}) {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDownloads = mode === "downloads";

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
              `Could not load your ${isDownloads ? "downloads" : "licences"}.`,
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
  }, [isDownloads]);

  const entries = useMemo(
    () =>
      isDownloads
        ? buildDownloadEntries(orders)
        : buildLicenceEntries(orders),
    [isDownloads, orders],
  );

  if (isLoading) return <LoadingState mode={mode} />;

  return (
    <section aria-labelledby={`${mode}-heading`}>
      <div className="mb-8 border-b border-white/10 pb-4">
        <h3
          id={`${mode}-heading`}
          className="font-serif text-3xl font-bold text-white"
        >
          {isDownloads ? "Downloads" : "Personal Licences"}
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          {isDownloads
            ? "Access purchased digital photo and video files. Links are one-time or expiring, so use them only when you are ready to download."
            : "Download personal-use licence PDFs for purchased digital assets. Commercial licence records will migrate separately."}
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState mode={mode} />
      ) : (
        <div className="space-y-5">
          {entries.map((entry) =>
            isDownloads ? (
              <DownloadCard
                key={entry.id}
                entry={entry as DigitalDownloadEntry}
              />
            ) : (
              <LicenceCard
                key={entry.id}
                entry={entry as PersonalLicenceEntry}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}
