import { isAnalyticsConsentGranted } from "../utils/iubendaConsent";

const GA_SCRIPT_ID = "openeire-ga-script";
const DENIED_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;
const GRANTED_CONSENT = {
  ...DENIED_CONSENT,
  analytics_storage: "granted",
} as const;

let gaInitialized = false;
let gaInitPromise: Promise<void> | null = null;
let gaScriptPromise: Promise<void> | null = null;

const getMeasurementId = (): string | null => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return measurementId ? measurementId : null;
};

const ensureDataLayer = (): void => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
};

const ensureGtagStub = (): void => {
  if (typeof window === "undefined") return;
  ensureDataLayer();

  if (typeof window.gtag === "function") return;

  window.gtag = function gtagStub(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
};

const loadGtagScript = (measurementId: string): Promise<void> => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(GA_SCRIPT_ID) as
    | HTMLScriptElement
    | null;
  if (existingScript?.dataset.loaded === "true") {
    return Promise.resolve();
  }

  if (existingScript && existingScript.dataset.loaded !== "error") {
    if (!gaScriptPromise) {
      gaScriptPromise = new Promise<void>((resolve, reject) => {
        const handleLoad = () => {
          existingScript.dataset.loaded = "true";
          resolve();
        };
        const handleError = () => {
          existingScript.dataset.loaded = "error";
          reject(
            new Error(
              `Failed to load Google Analytics script: ${existingScript.src}`,
            ),
          );
        };

        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", handleError, { once: true });
      }).catch((error) => {
        gaScriptPromise = null;
        throw error;
      });
    }

    return gaScriptPromise;
  }

  if (!gaScriptPromise) {
    gaScriptPromise = new Promise<void>((resolve, reject) => {
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");

      script.id = GA_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        measurementId,
      )}`;
      script.dataset.loaded = "false";
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => {
        script.dataset.loaded = "error";
        console.warn("Failed to load Google Analytics script:", script.src);
        reject(new Error(`Failed to load Google Analytics script: ${script.src}`));
      };

      document.head.appendChild(script);
    }).catch((error) => {
      gaScriptPromise = null;
      throw error;
    });
  }

  return gaScriptPromise;
};

export const updateAnalyticsConsent = (granted: boolean): void => {
  if (typeof window === "undefined") return;
  if (!getMeasurementId()) return;

  ensureGtagStub();
  window.gtag?.("consent", "update", granted ? GRANTED_CONSENT : DENIED_CONSENT);
};

export const initGA = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();

  const measurementId = getMeasurementId();
  if (!measurementId) return Promise.resolve();

  if (gaInitialized) return Promise.resolve();
  if (gaInitPromise) return gaInitPromise;

  ensureGtagStub();
  updateAnalyticsConsent(isAnalyticsConsentGranted());

  gaInitPromise = loadGtagScript(measurementId)
    .then(() => {
      gaInitialized = true;
    })
    .catch((error) => {
      console.warn(
        "GA initialisation deferred after script load failure; it will retry on later navigation or events.",
        error,
      );
      gaInitialized = false;
    })
    .finally(() => {
      gaInitPromise = null;
    });

  return gaInitPromise;
};

export const trackPageView = (path: string, title?: string): void => {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined") return;
  if (!isAnalyticsConsentGranted()) return;

  void initGA();
  ensureGtagStub();

  const pageTitle = title ?? document.title;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: pageTitle,
  });
};

export const trackEvent = (
  name: string,
  params: Record<string, unknown> = {},
): void => {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined") return;
  if (!isAnalyticsConsentGranted()) return;

  void initGA();
  ensureGtagStub();
  window.gtag?.("event", name, params);
};
