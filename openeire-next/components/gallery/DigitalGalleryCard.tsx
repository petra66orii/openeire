/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaCamera, FaExpand, FaImage, FaVideo } from "react-icons/fa";
import { formatEuro, getStartingPrice } from "@/lib/gallery/format";
import { resolveMediaUrl } from "@/lib/media";
import type { PublicGalleryItem } from "@/types/gallery";

const getDigitalItemHref = (item: PublicGalleryItem): string =>
  item.product_type === "video"
    ? `/gallery/video/${item.id}`
    : `/gallery/photo/${item.id}`;

const getDigitalItemLabel = (item: PublicGalleryItem): string =>
  item.product_type === "video" ? "Video" : "Photo";

export function DigitalGalleryCard({ item }: { item: PublicGalleryItem }) {
  const imageUrl = resolveMediaUrl(item.thumbnail_image || item.preview_image);
  const startingPrice = getStartingPrice(item);
  const displayPrice =
    startingPrice === undefined || startingPrice === null || startingPrice === ""
      ? null
      : formatEuro(startingPrice);
  const label = getDigitalItemLabel(item);
  const href = getDigitalItemHref(item);
  const Icon = item.product_type === "video" ? FaVideo : FaImage;

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <Link
        href={href}
        prefetch={false}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-900"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950 text-gray-600">
            <FaCamera className="text-4xl" aria-hidden="true" />
          </div>
        )}

        <div className="absolute right-3 top-3 z-20">
          <span className="flex items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-900 shadow-md backdrop-blur-md">
            <Icon className="mr-1 text-[8px]" /> {label}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 z-20 flex w-full translate-y-full items-end justify-between bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <div className="text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Personal use
            </p>
            <span className="font-serif text-lg font-bold">
              {displayPrice ? `€${displayPrice}` : "View details"}
            </span>
          </div>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-900 shadow-lg transition-all group-hover:scale-110 group-hover:bg-accent"
            aria-hidden="true"
          >
            <FaExpand className="text-sm" />
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href} prefetch={false}>
          <h2 className="mb-1 min-h-[3.5rem] font-serif text-lg font-bold leading-tight text-white transition-colors hover:text-accent">
            {item.title}
          </h2>
        </Link>
        <div className="mt-auto flex min-h-[2rem] items-center justify-between gap-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {item.collection || "Private collection"}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            {label}
          </p>
        </div>
      </div>
    </article>
  );
}
