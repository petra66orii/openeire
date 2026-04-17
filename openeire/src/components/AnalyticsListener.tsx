import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

const TITLE_SETTLE_TIMEOUT_MS = 1200;

const AnalyticsListener: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    const initialTitle = document.title;
    let settled = false;
    let observer: MutationObserver | null = null;
    let timeoutId = 0;
    let rafId = 0;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };

    const sendPageView = () => {
      if (settled) return;
      settled = true;
      cleanup();
      trackPageView(fullPath, document.title);
    };

    const titleNode = document.querySelector("title");
    observer =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            if (document.title !== initialTitle) {
              sendPageView();
            }
          });

    timeoutId = window.setTimeout(sendPageView, TITLE_SETTLE_TIMEOUT_MS);
    rafId = window.requestAnimationFrame(() => {
      if (document.title !== initialTitle) {
        sendPageView();
      }
    });

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
