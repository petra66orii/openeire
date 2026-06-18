"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaImage, FaVideo } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { DigitalGalleryCard } from "@/components/gallery/DigitalGalleryCard";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryToolbar } from "@/components/gallery/GalleryToolbar";
import { getProtectedDigitalGalleryItems } from "@/lib/api/gallery";
import {
  getCollectionLabel,
  isGalleryCollectionAvailable,
} from "@/lib/gallery/collections";
import type {
  DigitalGalleryFilter,
  PaginatedResponse,
  PublicGalleryItem,
} from "@/types/gallery";

type GalleryLoadState = "idle" | "loading" | "success" | "error";

const digitalFilters: Array<{
  value: DigitalGalleryFilter;
  label: string;
  icon?: IconType;
}> = [
  { value: "all", label: "All digital" },
  { value: "photo", label: "Photos", icon: FaImage },
  { value: "video", label: "Videos", icon: FaVideo },
];

const getSafeDigitalFilter = (
  value: string | null,
): DigitalGalleryFilter =>
  value === "photo" || value === "video" ? value : "all";

const buildGateHref = (pathname: string | null): string =>
  `/gallery-gate?next=${encodeURIComponent(pathname || "/gallery/digital")}`;

const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "The private gallery could not be loaded right now. Please try again shortly.";
};

export function DigitalGalleryClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: isAuthLoading, user } = useAuth();
  const [galleryPage, setGalleryPage] =
    useState<PaginatedResponse<PublicGalleryItem> | null>(null);
  const [loadState, setLoadState] = useState<GalleryLoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasGalleryAccess = Boolean(user?.can_access_gallery);
  const collection = searchParams.get("collection")?.trim() || "all";
  const search = searchParams.get("search")?.trim() || "";
  const sort = searchParams.get("sort")?.trim() || "date_desc";
  const page = searchParams.get("page") || undefined;
  const itemType = getSafeDigitalFilter(searchParams.get("itemType"));
  const collectionLabel = getCollectionLabel(collection);
  const isCollectionComingSoon = !isGalleryCollectionAvailable(collection);
  const gateHref = buildGateHref(pathname);

  useEffect(() => {
    if (!isAuthLoading && !hasGalleryAccess) {
      router.replace(gateHref);
    }
  }, [gateHref, hasGalleryAccess, isAuthLoading, router]);

  useEffect(() => {
    if (isAuthLoading || !hasGalleryAccess || isCollectionComingSoon) {
      setGalleryPage(
        isCollectionComingSoon
          ? { count: 0, next: null, previous: null, results: [] }
          : null,
      );
      setLoadState(isCollectionComingSoon ? "success" : "idle");
      return;
    }

    const controller = new AbortController();
    setLoadState("loading");
    setErrorMessage(null);

    getProtectedDigitalGalleryItems({
      collection,
      search,
      sort,
      page,
      itemType,
      signal: controller.signal,
    })
      .then((response) => {
        if (controller.signal.aborted) return;
        setGalleryPage(response);
        setLoadState("success");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setGalleryPage(null);
        setErrorMessage(getApiErrorMessage(error));
        setLoadState("error");
      });

    return () => {
      controller.abort();
    };
  }, [
    collection,
    hasGalleryAccess,
    isAuthLoading,
    isCollectionComingSoon,
    itemType,
    page,
    search,
    sort,
  ]);

  const buildFilterHref = useCallback(
    (nextItemType: DigitalGalleryFilter): string => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextItemType === "all") {
        params.delete("itemType");
      } else {
        params.set("itemType", nextItemType);
      }
      params.delete("page");
      const query = params.toString();
      return query ? `/gallery/digital?${query}` : "/gallery/digital";
    },
    [searchParams],
  );

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
            Private gallery
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Taking you to the private collection access flow.
          </p>
        </div>
      </div>
    );
  }

  const items = galleryPage?.results ?? [];
  const showFilterState = Boolean(
    search || itemType !== "all" || (collection && collection !== "all"),
  );

  return (
    <div className="page-top-offset min-h-screen bg-black pb-20 text-white">
      <GalleryHero activeCollection={collection} galleryPath="/gallery/digital" />

      <div className="container mx-auto mb-4 mt-2 px-4 lg:hidden lg:px-8">
        <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">
            Private digital archive
          </div>
          <h2 className="mt-2 font-serif text-lg font-bold text-white">
            Browse licensed photos and footage for personal use.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Use search and filters to find protected digital images and videos.
            Detail pages are private and never prefetched.
          </p>
        </div>
      </div>

      <GalleryToolbar
        search={search}
        sort={sort}
        collection={collection}
        actionPath="/gallery/digital"
      />

      <div
        id="gallery-grid"
        className="container relative z-10 mx-auto px-4 lg:px-8"
      >
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {digitalFilters.map((filter) => {
            const isActive = filter.value === itemType;
            const Icon = filter.icon;
            return (
              <Link
                key={filter.value}
                href={buildFilterHref(filter.value)}
                scroll={false}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-brand-900"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {Icon ? <Icon className="text-[11px]" aria-hidden="true" /> : null}
                {filter.label}
              </Link>
            );
          })}
        </div>

        {showFilterState ? (
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {collection !== "all" ? collectionLabel : "All collections"}
            </span>
            {itemType !== "all" ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Type: {itemType === "photo" ? "Photos" : "Videos"}
              </span>
            ) : null}
            {search ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Search: {search}
              </span>
            ) : null}
            <Link href="/gallery/digital" className="text-accent hover:underline">
              Clear filters
            </Link>
          </div>
        ) : null}

        {loadState === "loading" ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-gray-500">
              Loading private gallery
            </p>
          </div>
        ) : loadState === "error" ? (
          <div className="py-20 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">
              Private gallery unavailable right now.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              {errorMessage}
            </p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <DigitalGalleryCard key={`${item.product_type}-${item.id}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            {isCollectionComingSoon ? (
              <>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {collectionLabel} is coming soon!
                </h2>
                <p className="mt-3 text-gray-400">
                  We&apos;re curating this private collection now. Check back
                  soon for new releases.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-white">
                  No private media found.
                </h2>
                <p className="mt-3 text-gray-400">
                  Try clearing filters or checking back as new licensed visuals
                  are added.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
