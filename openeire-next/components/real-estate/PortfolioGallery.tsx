"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from "react-icons/fa";
import styles from "@/components/real-estate/PortfolioGallery.module.css";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioImage } from "@/lib/realEstatePortfolio";

type PortfolioGalleryProps = {
  images: readonly PortfolioImage[];
  projectSlug: string;
};

export type PortfolioGalleryEntry = {
  image: PortfolioImage;
  originalIndex: number;
};

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CLONE_SEQUENCE_COUNT = 2;

export const splitPortfolioGalleryRows = (
  images: readonly PortfolioImage[],
): readonly [readonly PortfolioGalleryEntry[], readonly PortfolioGalleryEntry[]] => {
  const rows: [PortfolioGalleryEntry[], PortfolioGalleryEntry[]] = [[], []];

  images.forEach((image, originalIndex) => {
    rows[originalIndex % 2].push({ image, originalIndex });
  });

  return rows;
};

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
  const rows = splitPortfolioGalleryRows(images);

  const close = useCallback(() => {
    const trigger = openerRef.current;
    setActiveIndex(null);
    window.requestAnimationFrame(() => trigger?.focus());
  }, []);

  const move = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((current) => {
        if (current === null || images.length < 2) return current;
        return (current + direction + images.length) % images.length;
      });
    },
    [images.length],
  );

  const markFailed = useCallback((src: string) => {
    setFailedSources((current) => {
      const next = new Set(current);
      next.add(src);
      return next;
    });
  }, []);

  const openImage = (
    originalIndex: number,
    trigger: HTMLButtonElement | null,
  ) => {
    openerRef.current = trigger;
    setActiveIndex(originalIndex);
    trackEvent("portfolio_gallery_open", {
      project_slug: projectSlug,
      image_index: originalIndex + 1,
    });
  };

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

  const renderOriginal = ({
    image,
    originalIndex,
  }: PortfolioGalleryEntry) => {
    const failed = failedSources.has(image.src);

    return (
      <figure
        key={`${image.src}-${originalIndex}`}
        className={styles.card}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        data-gallery-original="true"
      >
        <button
          ref={(node) => {
            triggerRefs.current[originalIndex] = node;
          }}
          type="button"
          disabled={failed}
          onClick={(event) => openImage(originalIndex, event.currentTarget)}
          className={styles.cardButton}
          aria-label={
            failed
              ? `Image unavailable: ${image.alt}`
              : `Open image ${originalIndex + 1} of ${images.length}: ${image.alt}`
          }
        >
          {failed ? (
            <span className={styles.imageFallback}>
              Image temporarily unavailable
            </span>
          ) : (
            <>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 767px) 82vw, (max-width: 1023px) 480px, 540px"
                className={styles.galleryImage}
                onError={() => markFailed(image.src)}
              />
              <span className={styles.expandControl} aria-hidden="true">
                <FaExpand />
              </span>
            </>
          )}
        </button>
        {image.caption ? (
          <figcaption className={styles.caption}>{image.caption}</figcaption>
        ) : null}
      </figure>
    );
  };

  const renderClone = ({
    image,
    originalIndex,
  }: PortfolioGalleryEntry) => (
    <div
      key={`${image.src}-${originalIndex}-clone`}
      className={styles.card}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      {failedSources.has(image.src) ? (
        <span className={styles.imageFallback}>Image temporarily unavailable</span>
      ) : (
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="(max-width: 1023px) 480px, 540px"
          className={styles.galleryImage}
          draggable={false}
        />
      )}
    </div>
  );

  return (
    <>
      <div
        className={styles.gallery}
        role="region"
        aria-label="Property photography gallery"
        data-gallery-mode="responsive-marquee"
      >
        {rows.map((row, rowIndex) =>
          row.length ? (
            <div
              key={`gallery-row-${rowIndex + 1}`}
              className={styles.row}
              data-gallery-row={rowIndex + 1}
              data-direction={rowIndex === 0 ? "forward" : "reverse"}
            >
              <div
                className={`${styles.track} ${
                  rowIndex === 0 ? styles.forward : styles.reverse
                }`}
              >
                <div
                  className={styles.sequence}
                  data-gallery-sequence="original"
                >
                  {row.map(renderOriginal)}
                </div>
                {Array.from({ length: CLONE_SEQUENCE_COUNT }, (_, cloneIndex) => (
                  <div
                    key={`gallery-row-${rowIndex + 1}-clone-${cloneIndex + 1}`}
                    className={`${styles.sequence} ${styles.cloneSequence}`}
                    aria-hidden="true"
                    data-gallery-sequence="clone"
                  >
                    {row.map(renderClone)}
                  </div>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>

      {activeImage ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Property photography viewer, image ${activeIndex! + 1} of ${images.length}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
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
