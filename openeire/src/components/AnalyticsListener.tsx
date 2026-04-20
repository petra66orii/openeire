import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

const TITLE_SETTLE_TIMEOUT_MS = 5000;
const TITLE_POLL_INTERVAL_MS = 100;
const PAGE_VIEW_DEDUPE_PREFIX = "openeire:page_view:";

const getNavigationInstanceId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `nav-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const AnalyticsListener: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    const navigationKey =
      location.key && location.key !== "default"
        ? location.key
        : `${fullPath}:${getNavigationInstanceId()}`;
    const dedupeKey = `${PAGE_VIEW_DEDUPE_PREFIX}${navigationKey}`;
    const initialTitle = document.title;
    let settled = false;
    let observer: MutationObserver | null = null;
    let timeoutId = 0;
    let pollId = 0;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(pollId);
      observer?.disconnect();
    };

    const sendPageView = (force = false) => {
      if (settled) return;
      if (!force && document.title === initialTitle) return;

      settled = true;
      cleanup();
      trackPageView(fullPath, document.title);

      try {
        window.sessionStorage.setItem(dedupeKey, "1");
      } catch {
        // Best-effort only; the in-memory settled flag still prevents duplicates.
      }
    };

    try {
      if (window.sessionStorage.getItem(dedupeKey) === "1") {
        return;
      }
    } catch {
      // Session storage may be unavailable in hardened browser contexts.
    }

    const titleNode = document.querySelector("title");
    observer =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            sendPageView(false);
          });

    pollId = window.setInterval(() => {
      sendPageView(false);
    }, TITLE_POLL_INTERVAL_MS);

    timeoutId = window.setTimeout(() => {
      sendPageView(true);
    }, TITLE_SETTLE_TIMEOUT_MS);

    if (observer && titleNode) {
      observer.observe(titleNode, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    return cleanup;
  }, [location.hash, location.pathname, location.search]);

  return null;
};

export default AnalyticsListener;

