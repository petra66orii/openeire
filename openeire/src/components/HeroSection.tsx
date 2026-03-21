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
    <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {shouldUseVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            className="absolute top-0 left-0 w-full h-full object-cover"
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
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </picture>
        )}
        <div className="absolute inset-0 bg-dark-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      <div className="relative z-10 px-4 w-full max-w-5xl mx-auto animate-fade-in-up">
        <div className="glass px-6 md:px-12 py-12 md:py-20 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md bg-black/20">
          <span className="inline-block py-1 px-4 rounded-full bg-black/40 border border-accent/60 text-accent text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            Est. 2026 {"\u2022"} Ireland
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
            Capturing the World <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-white to-accent filter drop-shadow-lg pb-2">
              From Above
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm font-sans">
            Stunning 4K aerial stock footage and premium art prints.{" "}
            <br className="hidden md:block" />
            Curated from the rugged coasts of Ireland and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center font-sans">
            <Link
              to="/gallery/digital"
              className="px-8 py-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-brand-700/40 border border-transparent"
            >
              Explore Footage
            </Link>

            <Link
              to="/gallery/physical"
              className="px-8 py-4 bg-white/5 hover:bg-white/20 text-white border border-white/40 rounded-full font-medium transition-all backdrop-blur-sm hover:border-white"
            >
              Shop Art Prints
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 md:h-48 bg-gradient-to-t from-dark to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;
