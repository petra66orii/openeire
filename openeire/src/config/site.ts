export const SITE_TITLE = "OpenÉire Studios";

export const getSiteOrigin = (): string => {
  const configured = import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) {
    try {
      const normalized = new URL(configured);
      if (normalized.protocol === "http:" || normalized.protocol === "https:") {
        normalized.pathname = "";
        normalized.search = "";
        normalized.hash = "";
        return normalized.toString().replace(/\/+$/, "");
      }
    } catch {
      // Fall back to the current origin when VITE_SITE_URL is misconfigured.
    }
  }

  if (typeof window === "undefined") return "";
  return window.location.origin;
};

export const buildAbsoluteSiteUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) return value;
  const origin = getSiteOrigin();
  if (!origin) return value;
  return new URL(value, `${origin}/`).toString();
};

export const getCurrentPageUrl = (): string => {
  if (typeof window === "undefined") return "";
  const origin = getSiteOrigin();
  const current = new URL(window.location.href);
  return origin
    ? new URL(`${current.pathname}${current.search}${current.hash}`, `${origin}/`).toString()
    : current.toString();
};

export const getCurrentCanonicalUrl = (): string => {
  if (typeof window === "undefined") return "";
  const origin = getSiteOrigin();
  const current = new URL(window.location.href);
  current.search = "";
  current.hash = "";
  return origin
    ? new URL(current.pathname, `${origin}/`).toString()
    : current.toString();
};