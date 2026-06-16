"use client";

import { useEffect, useState } from "react";
import { FaSearchPlus, FaTimes } from "react-icons/fa";

interface ProductMediaPreviewProps {
  imageUrl?: string;
  title: string;
}

export function ProductMediaPreview({
  imageUrl,
  title,
}: ProductMediaPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!imageUrl) {
    return (
      <div className="flex aspect-[4/3] min-h-[320px] w-full items-center justify-center bg-gray-900 px-8 text-center text-gray-500">
        Preview image unavailable
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block text-left"
        aria-label={`Open larger preview of ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="block h-auto max-h-[75vh] w-auto max-w-full shadow-lg"
        />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <FaSearchPlus aria-hidden="true" />
          View
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/5 p-3 text-white transition hover:bg-white/10"
            aria-label="Close image preview"
          >
            <FaTimes aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </>
  );
}
