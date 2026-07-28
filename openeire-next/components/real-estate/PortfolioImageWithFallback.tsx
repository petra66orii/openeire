"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioImage } from "@/lib/realEstatePortfolio";

export function PortfolioImageWithFallback({
  image,
  sizes,
  className,
}: {
  image: PortfolioImage;
  sizes: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${image.alt}. Image temporarily unavailable.`}
        className="flex h-full w-full items-center justify-center bg-gray-900 px-6 text-center text-sm text-gray-400"
      >
        Image temporarily unavailable
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
