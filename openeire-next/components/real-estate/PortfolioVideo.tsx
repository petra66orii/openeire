"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioVideo as PortfolioVideoData } from "@/lib/realEstatePortfolio";

export function PortfolioVideo({
  video,
  projectSlug,
}: {
  video: PortfolioVideoData;
  projectSlug: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <div
        className="overflow-hidden rounded-3xl bg-gray-900"
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
      >
        <video
          controls
          playsInline
          preload="none"
          poster={video.poster.src}
          aria-label={video.title}
          className="h-full w-full object-cover"
          onPlay={() =>
            trackEvent("portfolio_film_play", {
              project_slug: projectSlug,
              video_title: video.title,
            })
          }
        >
          {shouldLoad ? <source src={video.src} type="video/mp4" /> : null}
          Your browser does not support HTML video. You can request an
          accessible copy from OpenÉire Studios.
        </video>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-400">
        <span className="font-bold text-white">{video.title}.</span>{" "}
        {video.description}
      </p>
    </div>
  );
}

