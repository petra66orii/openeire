import {
  isAnalyticsConsentGranted,
  isIubendaManagingGoogleConsentMode,
  registerIubendaAnalyticsConsentCallback,
} from "@/lib/iubendaConsent";

type GtagArguments = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: GtagArguments[];
    gtag?: (...args: GtagArguments) => void;
  }
}

const DENIED_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;
let lastObservedAnalyticsConsent: boolean | null = null;

const ensureGtagStub = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: GtagArguments) => {
      window.dataLayer?.push(args);
    });
};

export const updateAnalyticsConsent = (granted: boolean): void => {
  if (typeof window === "undefined") return;
  ensureGtagStub();
  window.gtag?.("consent", "update", {
    ...DENIED_CONSENT,
    analytics_storage: granted ? "granted" : "denied",
  });
};

// The root layout owns script loading and the single GA config command.
export const initGA = (): Promise<void> => {
  if (typeof window === "undefined" || !isAnalyticsConsentGranted()) {
    return Promise.resolve();
  }
  ensureGtagStub();
  return Promise.resolve();
};

export const trackPageView = (path: string, title?: string): boolean => {
  if (typeof window === "undefined" || !isAnalyticsConsentGranted()) {
    return false;
  }

  void initGA().then(() => {
    window.gtag?.("event", "page_view", {
      page_path: path,
      page_title: title || document.title,
    });
  });
  return true;
};

export const trackEvent = (
  name: string,
  params: Record<string, unknown> = {},
): boolean => {
  if (typeof window === "undefined" || !isAnalyticsConsentGranted()) {
    return false;
  }

  void initGA().then(() => window.gtag?.("event", name, params));
  return true;
};

export const registerAnalyticsConsentListener = (onReady?: () => void) =>
  registerIubendaAnalyticsConsentCallback((granted) => {
    const previousConsent = lastObservedAnalyticsConsent;
    lastObservedAnalyticsConsent = granted;
    if (
      !isIubendaManagingGoogleConsentMode() &&
      previousConsent !== granted &&
      (granted || previousConsent === true)
    ) {
      updateAnalyticsConsent(granted);
    }
    if (granted) onReady?.();
  });
