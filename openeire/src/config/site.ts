export const SITE_TITLE = "Open\u00c9ire Studios";
export const SITE_TITLE_ASCII = "OpenEire Studios";
export const SITE_DESCRIPTION =
  "Premium aerial photography, fine art prints, commercial licensing, and curated visual assets from Ireland.";
export const SITE_CONTACT_EMAIL = "studio@openeire.ie";
export const DEFAULT_SOCIAL_IMAGE_PATH = "/hero-poster.jpg";
export const ORGANIZATION_LOGO_PATH = "/android-chrome-512x512-dark.png";

const normalizeConfiguredUrl = (value?: string): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    const normalized = new URL(trimmed);
    if (normalized.protocol !== "http:" && normalized.protocol !== "https:") {
      return null;
    }
    return normalized.toString();
  } catch {
    return null;
  }
};

export const SITE_SOCIAL_INSTAGRAM_URL = normalizeConfiguredUrl(
  import.meta.env.VITE_SITE_SOCIAL_INSTAGRAM_URL,
);
export const SITE_SOCIAL_YOUTUBE_URL = normalizeConfiguredUrl(
  import.meta.env.VITE_SITE_SOCIAL_YOUTUBE_URL,
);
export const SITE_SOCIAL_LINKS = {
  instagram: SITE_SOCIAL_INSTAGRAM_URL,
  youtube: SITE_SOCIAL_YOUTUBE_URL,
} as const;
export const SITE_SOCIAL_SAME_AS = Object.values(SITE_SOCIAL_LINKS).filter(
  (value): value is string => Boolean(value),
);

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
