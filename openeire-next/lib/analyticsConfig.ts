export const DEFAULT_GA_MEASUREMENT_ID = "G-96JSG3FV42";

const normalizeMeasurementId = (value: string | undefined): string | null => {
  const normalized = value?.trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return null;
  }
  return /^G-[A-Z0-9]+$/i.test(normalized) ? normalized : null;
};

export const GA_MEASUREMENT_ID =
  normalizeMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) ??
  DEFAULT_GA_MEASUREMENT_ID;

export const GA_SCRIPT_ID = "openeire-ga4-script";
export const GA_SCRIPT_SRC =
  `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

export const buildGoogleAnalyticsBootstrap = (): string => `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
window.gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500
});
window.gtag("js", new Date());
window.gtag("config", ${JSON.stringify(GA_MEASUREMENT_ID)}, { send_page_view: false });
`;
