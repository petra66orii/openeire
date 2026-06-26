"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  registerAnalyticsConsentListener,
  trackPageView,
} from "@/lib/analytics";

export function AnalyticsListener() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const trackCurrentPage = () => {
    const fullPath = `${pathnameRef.current}${window.location.search}`;
    if (lastTrackedPathRef.current === fullPath) return;
    lastTrackedPathRef.current = fullPath;
    trackPageView(fullPath, document.title);
  };

  useEffect(
    () => registerAnalyticsConsentListener(trackCurrentPage),
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      trackCurrentPage();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
