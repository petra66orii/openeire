const GA_SCRIPT_ID = "openeire-ga-script";

let gaInitialized = false;
let gaScriptPromise: Promise<void> | null = null;
let lastTrackedPageSignature: string | null = null;

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

  const existingScript = document.getElementById(GA_SCRIPT_ID);
  if (existingScript) {
    return Promise.resolve();
  }

  if (!gaScriptPromise) {
    gaScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.id = GA_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        measurementId,
      )}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Analytics"));
      document.head.appendChild(script);
    }).catch((error) => {
      gaScriptPromise = null;
      throw error;
    });
  }

  return gaScriptPromise;
};

export const initGA = (): void => {
  if (gaInitialized || typeof window === "undefined") return;

  const measurementId = getMeasurementId();
  if (!measurementId) return;

  ensureGtagStub();
  gaInitialized = true;

  void loadGtagScript(measurementId).catch(() => {
    // Fail quietly: analytics should never break the app.
  });

  window.gtag?.("js", new Date());
  window.gtag?.("config", measurementId, {
    send_page_view: false,
  });
};

export const trackPageView = (path: string, title?: string): void => {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined") return;

  ensureGtagStub();

  const pageTitle = title ?? document.title;
  const pageSignature = `${path}::${pageTitle}`;
  if (pageSignature === lastTrackedPageSignature) return;
  lastTrackedPageSignature = pageSignature;

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

  ensureGtagStub();
  window.gtag?.("event", name, params);
};
