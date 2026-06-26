import {
  isAnalyticsConsentGranted,
  registerIubendaConsentGrantedCallback,
} from "@/lib/iubendaConsent";

type GtagArguments = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: GtagArguments[];
    gtag?: (...args: GtagArguments) => void;
  }
}

const GA_SCRIPT_ID = "openeire-ga4-script";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
let initPromise: Promise<void> | null = null;

const hasMeasurementId = () =>
  measurementId.length > 0 &&
  measurementId !== "undefined" &&
  measurementId !== "null";

const ensureGtagStub = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: GtagArguments) => {
      window.dataLayer?.push(args);
    });
};

export const initGA = (): Promise<void> => {
  if (
    typeof window === "undefined" ||
    !hasMeasurementId() ||
    !isAnalyticsConsentGranted()
  ) {
    return Promise.resolve();
  }

  if (initPromise) return initPromise;

  ensureGtagStub();

  const existingScript = document.getElementById(GA_SCRIPT_ID);
  if (existingScript) {
    window.gtag?.("js", new Date());
    window.gtag?.("config", measurementId, { send_page_view: false });
    initPromise = Promise.resolve();
    return initPromise;
  }

  initPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => {
      window.gtag?.("js", new Date());
      window.gtag?.("config", measurementId, { send_page_view: false });
      resolve();
    };
    script.onerror = () => {
      initPromise = null;
      reject(new Error("Failed to load Google Analytics."));
    };
    document.head.appendChild(script);
  });

  return initPromise;
};

export const trackPageView = (path: string, title?: string) => {
  if (
    typeof window === "undefined" ||
    !hasMeasurementId() ||
    !isAnalyticsConsentGranted()
  ) {
    return;
  }

  void initGA()
    .then(() => {
      window.gtag?.("event", "page_view", {
        page_path: path,
        page_title: title || document.title,
      });
    })
    .catch(() => undefined);
};

export const trackEvent = (
  name: string,
  params: Record<string, unknown> = {},
) => {
  if (
    typeof window === "undefined" ||
    !hasMeasurementId() ||
    !isAnalyticsConsentGranted()
  ) {
    return;
  }

  void initGA()
    .then(() => window.gtag?.("event", name, params))
    .catch(() => undefined);
};

export const registerAnalyticsConsentListener = (onReady?: () => void) =>
  registerIubendaConsentGrantedCallback(() => {
    void initGA()
      .then(() => onReady?.())
      .catch(() => undefined);
  });
