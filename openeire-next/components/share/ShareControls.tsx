"use client";

import { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaLink, FaShareAlt } from "react-icons/fa";

interface ShareControlsProps {
  title: string;
  url: string;
}

export function ShareControls({ title, url }: ShareControlsProps) {
  const [copyLabel, setCopyLabel] = useState("Copy link");
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({ title, url });
    } catch {
      // Users can cancel native share sheets; no UI error needed.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy link"), 1800);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy link"), 1800);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-gray-500">
      <span>Share</span>
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-gray-300 transition-colors hover:border-brand-500/40 hover:text-brand-500"
      >
        <FaShareAlt aria-hidden="true" />
        Share
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-gray-300 transition-colors hover:border-brand-500/40 hover:text-brand-500"
      >
        <FaLink aria-hidden="true" />
        {copyLabel}
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-gray-300 transition-colors hover:border-brand-500/40 hover:text-brand-500"
      >
        <FaFacebookF aria-hidden="true" />
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-gray-300 transition-colors hover:border-brand-500/40 hover:text-brand-500"
      >
        <FaLinkedinIn aria-hidden="true" />
        LinkedIn
      </a>
    </div>
  );
}
