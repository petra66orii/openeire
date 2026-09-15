"use client";

import { useEffect, useState } from "react";
import type { RealEstatePortfolioProject } from "@/lib/realEstatePortfolio";

type PortfolioPropertyNavigatorProps = {
  projects: readonly Pick<RealEstatePortfolioProject, "anchorId" | "title">[];
};

export function PortfolioPropertyNavigator({
  projects,
}: PortfolioPropertyNavigatorProps) {
  const [activeAnchorId, setActiveAnchorId] = useState(
    projects[0]?.anchorId ?? "",
  );

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(first.boundingClientRect.top) -
              Math.abs(second.boundingClientRect.top),
          )[0];

        if (visibleEntry) setActiveAnchorId(visibleEntry.target.id);
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      },
    );

    projects.forEach(({ anchorId }) => {
      const section = document.getElementById(anchorId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [projects]);

  const links = projects.map(({ anchorId, title }) => {
    const isActive = anchorId === activeAnchorId;

    return (
      <li key={anchorId}>
        <a
          href={`#${anchorId}`}
          aria-current={isActive ? "location" : undefined}
          className={`group flex items-start gap-3 text-sm leading-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-black ${
            isActive
              ? "font-semibold text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <span
            className={`mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
              isActive ? "bg-accent" : "bg-white/25 group-hover:bg-white/60"
            }`}
            aria-hidden="true"
          />
          <span>{title}</span>
        </a>
      </li>
    );
  });

  return (
    <nav
      aria-label="Portfolio properties"
      className="portfolio-property-navigation h-full"
    >
      <div className="border-y border-white/10 py-5 xl:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Jump to property
        </p>
        <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">{links}</ul>
      </div>

      <div className="sticky top-[calc(var(--site-header-height,96px)+1.5rem)] hidden border-l border-white/10 pl-6 xl:block">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          On this page
        </p>
        <ul className="mt-5 space-y-4">{links}</ul>
      </div>
    </nav>
  );
}
