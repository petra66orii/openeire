"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioImage } from "@/lib/realEstatePortfolio";

type PortfolioGalleryProps = {
  images: readonly PortfolioImage[];
  projectSlug: string;
};

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function PortfolioGallery({
  images,
  projectSlug,
}: PortfolioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failedSources, setFailedSources] = useState<Set<string>>(
    () => new Set(),
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const close = useCallback(() => {
    const trigger = openerRef.current;
    setActiveIndex(null);
    window.requestAnimationFrame(() => trigger?.focus());
  }, []);

  const move = useCallback((direction: -1 | 1) => {
    setActiveIndex((current) => {
      if (current === null || images.length < 2) return current;
      return (current + direction + images.length) % images.length;
    });
  }, [images.length]);

  const markFailed = useCallback((src: string) => {
    setFailedSources((current) => {
      const next = new Set(current);
      next.add(src);
      return next;
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, close, move]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {images.map((image, index) => {
          const isPortrait = image.height > image.width;
          const failed = failedSources.has(image.src);
          return (
            <figure
              key={`${image.src}-${index}`}
              className={`group relative overflow-hidden rounded-3xl bg-gray-900 ${
                isPortrait
                  ? "sm:row-span-2 lg:col-span-4"
                  : index % 3 === 0
                    ? "lg:col-span-8"
                    : "lg:col-span-4"
              }`}
            >
              <button
                ref={(node) => {
                  triggerRefs.current[index] = node;
                }}
                type="button"
                disabled={failed}
                onClick={() => {
                  openerRef.current = triggerRefs.current[index];
                  setActiveIndex(index);
                  trackEvent("portfolio_gallery_open", {
                    project_slug: projectSlug,
                    image_index: index + 1,
                  });
                }}
                className="relative h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent disabled:cursor-default"
                aria-label={
                  failed
                    ? `Image unavailable: ${image.alt}`
                    : `Open image ${index + 1} of ${images.length}: ${image.alt}`
                }
              >
                {failed ? (
                  <span className="flex h-full w-full items-center justify-center bg-gray-900 px-6 text-center text-sm text-gray-400">
                    Image temporarily unavailable
                  </span>
                ) : (
                  <>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                      className="object-cover transition duration-500 motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                      onError={() => markFailed(image.src)}
                    />
                    <span className="absolute bottom-4 right-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/75 text-white opacity-90 backdrop-blur">
                      <FaExpand aria-hidden="true" />
                    </span>
                  </>
                )}
              </button>
              {image.caption ? (
                <figcaption className="absolute bottom-0 left-0 max-w-[80%] bg-black/75 px-4 py-2 text-xs text-gray-200">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>

      {activeImage ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Property photography viewer, image ${activeIndex! + 1} of ${images.length}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/25 bg-black/80 text-white hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close image viewer"
          >
            <FaTimes aria-hidden="true" />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() => move(-1)}
              className="absolute left-3 z-10 flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/25 bg-black/80 text-white hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-6"
              aria-label="View previous image"
            >
              <FaChevronLeft aria-hidden="true" />
            </button>
          ) : null}

          <figure className="flex max-h-full max-w-6xl flex-col items-center gap-3">
            {failedSources.has(activeImage.src) ? (
              <div className="flex min-h-80 min-w-72 items-center justify-center rounded-xl bg-gray-900 px-8 text-center text-gray-400">
                Image temporarily unavailable
              </div>
            ) : (
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                sizes="95vw"
                className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain"
                priority
                onError={() => markFailed(activeImage.src)}
              />
            )}
            <figcaption className="text-center text-sm text-gray-300">
              {activeImage.caption ?? activeImage.alt}
            </figcaption>
          </figure>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() => move(1)}
              className="absolute right-3 z-10 flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/25 bg-black/80 text-white hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-6"
              aria-label="View next image"
            >
              <FaChevronRight aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
