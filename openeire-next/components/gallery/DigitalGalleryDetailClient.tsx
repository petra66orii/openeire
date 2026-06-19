"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFileContract,
  FaImage,
  FaShoppingBag,
  FaVideo,
} from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { CommercialLicenceRequestModal } from "@/components/gallery/CommercialLicenceRequestModal";
import { DigitalGalleryCard } from "@/components/gallery/DigitalGalleryCard";
import { ProductMediaPreview } from "@/components/gallery/ProductMediaPreview";
import { SpecBox } from "@/components/gallery/SpecBox";
import { useToast } from "@/components/ui/ToastProvider";
import { isApiError } from "@/lib/api/client";
import { getProtectedDigitalDetail } from "@/lib/api/gallery";
import { formatEuro, getStartingPrice, splitTags } from "@/lib/gallery/format";
import { resolveMediaUrl } from "@/lib/media";
import type { ProtectedDigitalDetail } from "@/types/gallery";

type DetailKind = "photo" | "video";
type DetailLoadState = "idle" | "loading" | "success" | "notFound" | "error";

const buildGateHref = (pathname: string | null): string =>
  `/gallery-gate?next=${encodeURIComponent(pathname || "/gallery/digital")}`;

const formatDate = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-IE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const formatDuration = (value?: number | string | null): string => {
  if (value === undefined || value === null || value === "") return "N/A";
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return String(value);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes <= 0) return `${remainingSeconds}s`;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getLoadErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    if (error.response?.status === 404) {
      return "not-found";
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "access-denied";
    }
  }
  return "This private asset could not be loaded right now. Please try again shortly.";
};

function VideoPreview({
  posterUrl,
  title,
  videoUrl,
}: {
  posterUrl?: string;
  title: string;
  videoUrl?: string;
}) {
  if (!videoUrl) {
    return (
      <div className="relative flex aspect-video min-h-80 w-full items-center justify-center overflow-hidden bg-gray-900 px-8 text-center text-gray-500">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-35 blur-sm"
          />
        ) : null}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <FaVideo className="text-4xl" aria-hidden="true" />
          <p>Video preview unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      poster={posterUrl}
      controls
      preload="metadata"
      playsInline
      className="block h-auto max-h-[75vh] w-auto max-w-full bg-black shadow-lg"
    >
      <track kind="captions" />
    </video>
  );
}

export function DigitalGalleryDetailClient({
  id,
  type,
}: {
  id: string;
  type: DetailKind;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading: isAuthLoading, user } = useAuth();
  const { addToCart, isLoaded: isCartLoaded } = useCart();
  const { showToast } = useToast();
  const [detail, setDetail] = useState<ProtectedDigitalDetail | null>(null);
  const [loadState, setLoadState] = useState<DetailLoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLicenceModalOpen, setIsLicenceModalOpen] = useState(false);

  const hasGalleryAccess = Boolean(user?.can_access_gallery);
  const gateHref = buildGateHref(pathname);

  useEffect(() => {
    if (!isAuthLoading && !hasGalleryAccess) {
      router.replace(gateHref);
    }
  }, [gateHref, hasGalleryAccess, isAuthLoading, router]);

  useEffect(() => {
    if (isAuthLoading || !hasGalleryAccess) {
      setDetail(null);
      setLoadState("idle");
      return;
    }

    const controller = new AbortController();
    setLoadState("loading");
    setErrorMessage(null);

    getProtectedDigitalDetail(type, id, { signal: controller.signal })
      .then((payload) => {
        if (controller.signal.aborted) return;
        setDetail(payload);
        setLoadState("success");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        const message = getLoadErrorMessage(error);
        if (message === "access-denied") {
          router.replace(gateHref);
          return;
        }
        setDetail(null);
        setLoadState(message === "not-found" ? "notFound" : "error");
        setErrorMessage(message === "not-found" ? null : message);
      });

    return () => {
      controller.abort();
    };
  }, [gateHref, hasGalleryAccess, id, isAuthLoading, router, type]);

  const media = useMemo(() => {
    if (!detail) return { imageUrl: undefined, videoUrl: undefined };
    return {
      imageUrl: resolveMediaUrl(detail.preview_image || detail.thumbnail_image),
      videoUrl:
        detail.product_type === "video"
          ? resolveMediaUrl(detail.preview_video_url)
          : undefined,
    };
  }, [detail]);

  if (isAuthLoading) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="sr-only">Checking gallery access</span>
      </div>
    );
  }

  if (!hasGalleryAccess) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="max-w-md rounded-2xl border border-white/10 bg-gray-900/50 p-8 shadow-2xl">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            Redirecting
          </p>
          <h1 className="mt-3 font-serif text-2xl font-bold">
            Private {type}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Taking you to the private collection access flow.
          </p>
        </div>
      </div>
    );
  }

  if (loadState === "loading" || loadState === "idle") {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="sr-only">Loading private asset</span>
      </div>
    );
  }

  if (loadState === "notFound") {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-gray-900/50 p-8">
          <h1 className="font-serif text-3xl font-bold">
            Private asset not found.
          </h1>
          <p className="mt-4 text-gray-400">
            It may have been removed from the private collection.
          </p>
          <Link
            href="/gallery/digital"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to Private Gallery
          </Link>
        </div>
      </div>
    );
  }

  if (loadState === "error" || !detail) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-gray-900/50 p-8">
          <h1 className="font-serif text-3xl font-bold">
            This private asset is unavailable right now.
          </h1>
          <p className="mt-4 text-gray-400">{errorMessage}</p>
          <Link
            href="/gallery/digital"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to Private Gallery
          </Link>
        </div>
      </div>
    );
  }

  const isVideo = detail.product_type === "video";
  const displayPrice = formatEuro(getStartingPrice(detail));
  const tags = splitTags(detail.tags);
  const capturedDate = formatDate(detail.created_at);
  const relatedProducts = detail.related_products ?? [];
  const legalTermsHref = "https://openeire.ie/licensing/terms";
  const handleAddToCart = () => {
    if (!isCartLoaded) return;

    addToCart({
      product: {
        id: detail.id,
        title: detail.title,
        product_type: detail.product_type,
        price: detail.price ?? detail.starting_price ?? null,
        starting_price: detail.starting_price ?? null,
        preview_image: detail.preview_image ?? null,
        thumbnail_image: detail.thumbnail_image ?? null,
        collection: detail.collection ?? null,
      },
      quantity: 1,
      options: {
        type: "digital",
        sourceProductId: detail.id,
      },
    });
    showToast("Added to bag.", "success");
  };

  return (
    <div className="page-top-offset min-h-screen overflow-x-hidden bg-black pb-20 font-sans text-white selection:bg-accent selection:text-black">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link
            href="/gallery/digital"
            className="inline-flex items-center gap-2 transition-colors hover:text-accent"
          >
            <FaArrowLeft aria-hidden="true" />
            Private Gallery
          </Link>
          <span>/</span>
          <span className="text-gray-400">{isVideo ? "Video" : "Photo"}</span>
          <span>/</span>
          <span className="max-w-50 truncate text-white">{detail.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-8">
            <div className="sticky top-32">
              <div className="relative mx-auto w-fit overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
                {isVideo ? (
                  <VideoPreview
                    posterUrl={media.imageUrl}
                    title={detail.title}
                    videoUrl={media.videoUrl}
                  />
                ) : (
                  <ProductMediaPreview
                    imageUrl={media.imageUrl}
                    title={detail.title}
                  />
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-4">
                <SpecBox
                  label="Resolution"
                  value={isVideo ? detail.resolution || "High Res" : "High Res"}
                />
                <SpecBox
                  label="Format"
                  value={isVideo ? "Video Preview" : "Fine Art / JPEG"}
                />
                <SpecBox
                  label="Frame Rate"
                  value={isVideo ? detail.frame_rate || "N/A" : "N/A"}
                />
                <SpecBox
                  label="Duration"
                  value={isVideo ? formatDuration(detail.duration) : "N/A"}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-sm md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-900">
                {isVideo ? <FaVideo aria-hidden="true" /> : <FaImage aria-hidden="true" />}
                {isVideo ? "Video" : "Photo"}
              </div>

              <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
                {detail.title}
              </h1>

              {detail.description ? (
                <p className="mb-8 border-l-2 border-accent pl-4 text-sm leading-relaxed text-gray-400">
                  {detail.description}
                </p>
              ) : null}

              <div className="space-y-4 border-y border-white/10 py-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400">Personal use</span>
                  <span className="font-serif text-3xl font-bold text-white">
                    {"\u20AC"}
                    {displayPrice}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  Buy this {isVideo ? "video" : "photo"} for personal use.
                  Commercial usage requires a separate rights-managed licence
                  request.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isCartLoaded}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-4 text-sm font-bold text-paper transition-all hover:bg-brand-500 active:scale-[0.98] disabled:cursor-wait disabled:bg-brand-700/60 disabled:opacity-75"
                >
                  <FaShoppingBag aria-hidden="true" />
                  {isCartLoaded ? "Add to Cart" : "Preparing Bag..."}
                </button>

                <button
                  type="button"
                  onClick={() => setIsLicenceModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-5 py-4 text-sm font-bold text-white transition-all hover:bg-white hover:text-black active:scale-[0.98]"
                >
                  <FaFileContract aria-hidden="true" />
                  Request Commercial Licence
                </button>

                <a
                  href={legalTermsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs font-semibold text-gray-500 underline-offset-4 transition-colors hover:text-gray-300 hover:underline"
                >
                  View licence terms
                </a>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-500">
                {detail.collection ? (
                  <p>
                    <span className="font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Collection:
                    </span>{" "}
                    {detail.collection}
                  </p>
                ) : null}
                {capturedDate ? (
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt aria-hidden="true" />
                    Added {capturedDate}
                  </p>
                ) : null}
              </div>
            </div>

            {tags.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.slice(0, 12).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {relatedProducts.length ? (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-2xl font-bold text-white">
              Related Private {isVideo ? "Videos" : "Photos"}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <DigitalGalleryCard
                  key={`${related.product_type}-${related.id}`}
                  item={related}
                />
              ))}
            </div>
          </section>
        ) : null}

        <CommercialLicenceRequestModal
          isOpen={isLicenceModalOpen}
          onClose={() => setIsLicenceModalOpen(false)}
          assetId={detail.id}
          assetType={detail.product_type}
          assetTitle={detail.title}
        />
      </div>
    </div>
  );
}
