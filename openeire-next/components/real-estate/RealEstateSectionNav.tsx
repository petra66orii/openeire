"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

export const REAL_ESTATE_SECTION_LINKS = [
  { id: "packages", label: "Packages" },
  { id: "custom", label: "Custom / POA" },
  { id: "addons", label: "Add-ons" },
  { id: "process", label: "How It Works" },
  { id: "faqs", label: "FAQs" },
  { id: "enquire", label: "Enquire" },
] as const;

type SectionId = (typeof REAL_ESTATE_SECTION_LINKS)[number]["id"];

const isSectionId = (value: string): value is SectionId =>
  REAL_ESTATE_SECTION_LINKS.some(({ id }) => id === value);

const getHashSection = (): SectionId | null => {
  const hash = window.location.hash.slice(1);
  return isSectionId(hash) ? hash : null;
};

export function RealEstateSectionNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("packages");

  useEffect(() => {
    const root = document.documentElement;
    const updateNavHeight = () => {
      const height = navRef.current?.getBoundingClientRect().height;
      if (height) {
        root.style.setProperty("--real-estate-section-nav-height", `${height}px`);
      }
    };

    updateNavHeight();
    if (typeof ResizeObserver === "undefined" || !navRef.current) return;

    const resizeObserver = new ResizeObserver(updateNavHeight);
    resizeObserver.observe(navRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const hashSection = getHashSection();
    if (!hashSection) return;

    setActiveSection(hashSection);
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(hashSection)
        ?.scrollIntoView?.({ block: "start", behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const headerHeight = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--site-header-height",
      ),
    );
    const stickyOffset =
      (Number.isFinite(headerHeight) ? headerHeight : 96) +
      (navRef.current?.getBoundingClientRect().height ?? 64) +
      8;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting && isSectionId(entry.target.id))
          .sort(
            (first, second) =>
              Math.abs(first.boundingClientRect.top - stickyOffset) -
              Math.abs(second.boundingClientRect.top - stickyOffset),
          )[0];

        if (visibleEntry && isSectionId(visibleEntry.target.id)) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: `-${stickyOffset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75],
      },
    );

    REAL_ESTATE_SECTION_LINKS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navigateToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    id: SectionId,
  ) => {
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveSection(id);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Property media page sections"
      className="real-estate-section-navigation sticky top-[var(--site-header-height,96px)] z-30 border-y border-white/10 bg-gray-950/95 shadow-lg shadow-black/20 backdrop-blur-md"
    >
      <div className="scrollbar-hide overflow-x-auto overscroll-x-contain px-4 lg:px-8">
        <ul className="mx-auto flex min-w-max max-w-7xl flex-nowrap items-center gap-1 py-2">
          {REAL_ESTATE_SECTION_LINKS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => navigateToSection(event, id)}
                  className={`flex min-h-11 items-center whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 ${
                    isActive
                      ? "border-brand-500/70 bg-brand-500/10 text-accent"
                      : "border-transparent text-gray-300 hover:border-white/15 hover:text-white"
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
