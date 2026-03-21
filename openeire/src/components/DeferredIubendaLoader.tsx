import { useEffect } from "react";

const IUBENDA_WIDGET_SRC =
  "https://embeds.iubenda.com/widgets/c1a64030-d117-4ceb-823e-d39815727f36.js";
const IUBENDA_LOAD_DELAY_MS = 1500;
const IUBENDA_IDLE_TIMEOUT_MS = 2000;

declare global {
  interface Window {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  }
}

const loadIubendaScript = () => {
  if (document.querySelector(`script[src="${IUBENDA_WIDGET_SRC}"]`)) return;

  const script = document.createElement("script");
  script.src = IUBENDA_WIDGET_SRC;
  script.async = true;
  script.type = "text/javascript";
  document.head.appendChild(script);
};

const DeferredIubendaLoader = () => {
  useEffect(() => {
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    let fallbackTimeoutId: number | null = null;
    let hasScheduledLoad = false;

    const scheduleLoad = () => {
      const delayedLoad = () => {
        if (hasScheduledLoad) return;
        hasScheduledLoad = true;
        timeoutId = window.setTimeout(loadIubendaScript, IUBENDA_LOAD_DELAY_MS);
      };

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(delayedLoad, {
          timeout: IUBENDA_IDLE_TIMEOUT_MS,
        });
        fallbackTimeoutId = window.setTimeout(
          delayedLoad,
          IUBENDA_IDLE_TIMEOUT_MS,
        );
        return;
      }

      delayedLoad();
    };

    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleLoad);

      if (idleId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }

      if (fallbackTimeoutId !== null) {
        window.clearTimeout(fallbackTimeoutId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
};

export default DeferredIubendaLoader;
