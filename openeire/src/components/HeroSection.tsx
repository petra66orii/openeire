import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const shouldUseVideo = useMemo(
    () => viewportWidth >= 768 && !prefersReducedMotion,
    [prefersReducedMotion, viewportWidth],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncViewportPreferences = () => {
      setViewportWidth(window.innerWidth);
    };

    const reducedMotionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    syncViewportPreferences();
    setPrefersReducedMotion(reducedMotionQuery?.matches ?? false);
    window.addEventListener("resize", syncViewportPreferences);
    if (reducedMotionQuery) {
      if (typeof reducedMotionQuery.addEventListener === "function") {
        reducedMotionQuery.addEventListener(
          "change",
          handleMotionPreferenceChange,
        );
      } else {
        reducedMotionQuery.addListener(handleMotionPreferenceChange);
      }
    }

    return () => {
      window.removeEventListener("resize", syncViewportPreferences);
      if (reducedMotionQuery) {
        if (typeof reducedMotionQuery.removeEventListener === "function") {
          reducedMotionQuery.removeEventListener(
            "change",
            handleMotionPreferenceChange,
          );
        } else {
          reducedMotionQuery.removeListener(handleMotionPreferenceChange);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!shouldUseVideo) return;

    const existingPreload = document.querySelector(
      'link[rel="preload"][href="/hero-poster.jpg"]',
    );
    if (existingPreload) return;

    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = "/hero-poster.jpg";
    document.head.appendChild(preloadLink);

    return;
  }, [shouldUseVideo]);

  return (
    <div
      className="relative flex items-center justify-center text-center overflow-x-hidden overflow-y-hidden"
      style={{
        minHeight: "100svh",
        boxSizing: "border-box",
        paddingTop: "calc(var(--site-header-height, 0px) + 1rem)",
        paddingBottom: "2rem",
      }}
    >
      <div className="absolute inset-0 z-0">
        {shouldUseVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            className="absolute top-0 left-0 h-full w-full object-cover"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <picture>
            <source
              srcSet="/hero-poster-mobile.jpg"
              media="(max-width: 767px)"
            />
            <img
              src="/hero-poster.jpg"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute top-0 left-0 h-full w-full object-cover"
            />
          </picture>
        )}
        <div className="absolute inset-0 bg-dark-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 animate-fade-in-up">
        <div className="glass rounded-3xl border border-white/10 bg-black/20 px-5 py-10 shadow-2xl backdrop-blur-md sm:px-6 sm:py-12 md:px-12 md:py-20">
          <span className="mb-6 inline-block rounded-full border border-accent/60 bg-black/40 px-4 py-1 text-xs font-bold tracking-widest text-accent shadow-sm">
            Est. 2026 {"\u2022"} Ireland
          </span>

          <h1 className="mb-6 text-4xl font-serif font-bold leading-tight text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl">
            Capturing the World <br />
            <span className="bg-gradient-to-r from-brand-500 via-white to-accent bg-clip-text pb-2 text-transparent filter drop-shadow-lg">
              From Above
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl font-sans text-base leading-relaxed text-gray-100 drop-shadow-sm sm:text-lg md:text-xl font-light">
            Stunning 4K aerial stock footage and premium art prints.{" "}
            <br className="hidden md:block" />
            Curated from the rugged coasts of Ireland and beyond.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 font-sans sm:flex-row sm:gap-5">
            <Link
              to="/gallery/digital"
              className="w-full max-w-xs rounded-full border border-transparent bg-brand-700 px-8 py-4 font-bold text-white shadow-lg shadow-brand-700/40 transition-all hover:scale-105 hover:bg-brand-800 sm:w-auto"
            >
              Explore Footage
            </Link>

            <Link
              to="/gallery/physical"
              className="w-full max-w-xs rounded-full border border-white/40 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20 sm:w-auto"
            >
              Shop Art Prints
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-20 w-full bg-gradient-to-t from-dark to-transparent md:h-48"></div>
    </div>
  );
};

export default HeroSection;
