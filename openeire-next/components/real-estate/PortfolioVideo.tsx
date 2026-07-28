"use client";

import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaPlay } from "react-icons/fa";
import { PortfolioImageWithFallback } from "@/components/real-estate/PortfolioImageWithFallback";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioVideo as PortfolioVideoData } from "@/lib/realEstatePortfolio";

const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
export const VIDEO_LOAD_TIMEOUT_MS = 12_000;
type PlayerState = "idle" | "loading" | "ready" | "error";

export const isValidYouTubeVideoId = (videoId: string): boolean =>
  YOUTUBE_VIDEO_ID_PATTERN.test(videoId);

export function PortfolioVideo({
  video,
  projectSlug,
}: {
  video: PortfolioVideoData;
  projectSlug: string;
}) {
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const hasValidVideoId = isValidYouTubeVideoId(video.youtubeVideoId);
  const hasStarted = playerState !== "idle";
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  useEffect(() => {
    if (playerState !== "loading") return;

    const timeoutId = window.setTimeout(() => {
      setPlayerState((current) =>
        current === "loading" ? "error" : current,
      );
    }, VIDEO_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [playerState]);

  const startVideo = () => {
    if (!hasValidVideoId) return;
    trackEvent("portfolio_film_play", {
      project_slug: projectSlug,
      video_title: video.title,
      video_provider: "youtube",
    });
    setPlayerState("loading");
  };

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-3xl bg-gray-900"
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
      >
        {hasValidVideoId && playerState !== "ready" ? (
          <>
            <PortfolioImageWithFallback
              image={video.poster}
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-black/10"
              aria-hidden="true"
            />
          </>
        ) : null}

        {hasValidVideoId &&
        (playerState === "loading" || playerState === "ready") ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&playsinline=1&rel=0`}
            title={video.title}
            data-cmp-ab="1"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setPlayerState("ready")}
            className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${
              playerState === "ready"
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          />
        ) : null}

        {hasValidVideoId && playerState === "loading" ? (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 flex items-center justify-center bg-black/35 px-6 text-center text-sm font-semibold text-white"
          >
            Loading film…
          </div>
        ) : null}

        {hasValidVideoId && playerState === "idle" ? (
          <>
            <button
              type="button"
              onClick={startVideo}
              aria-label={`Play ${video.title} on YouTube`}
              className="group absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <span className="flex min-h-16 items-center gap-3 rounded-full border border-white/30 bg-black/75 px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-2xl backdrop-blur transition group-hover:scale-105 group-hover:border-accent group-hover:text-accent">
                <FaPlay aria-hidden="true" />
                Play film
              </span>
            </button>
          </>
        ) : null}

        {hasValidVideoId && playerState === "error" ? (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/65 px-6 text-center text-sm text-white"
          >
            <p>The embedded player could not be loaded.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setPlayerState("loading")}
                className="min-h-11 rounded-full border border-white/30 bg-black/70 px-5 py-3 font-bold hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Try again
              </button>
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Watch on YouTube
                <FaExternalLinkAlt aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : null}

        {!hasValidVideoId ? (
          <div
            role="status"
            className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-gray-400"
          >
            Video temporarily unavailable
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-400">
        <span className="font-bold text-white">{video.title}.</span>{" "}
        {video.description}
      </p>
      {!hasStarted && hasValidVideoId ? (
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          YouTube is loaded only after you press play.
        </p>
      ) : null}
      {hasStarted && hasValidVideoId ? (
        <a
          href={youtubeWatchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-gray-400 underline decoration-white/30 underline-offset-4 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Having trouble? Watch on YouTube
          <FaExternalLinkAlt aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}
