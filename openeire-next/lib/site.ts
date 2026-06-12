export const SITE_NAME = "OpenÉire Studios";
export const SITE_NAME_ASCII = "OpenEire Studios";
export const SITE_DESCRIPTION =
  "Premium aerial photography, fine art prints, commercial licensing, and curated visual assets from Ireland.";
export const SITE_CONTACT_EMAIL = "studio@openeire.ie";
export const DEFAULT_SOCIAL_IMAGE_PATH = "/hero-poster.jpg";
export const ORGANIZATION_LOGO_PATH = "/android-chrome-512x512-dark.png";

export const getSiteUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return "https://openeire.ie";

  try {
    const url = new URL(configured);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "https://openeire.ie";
  }
};

export const buildAbsoluteUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, `${getSiteUrl()}/`).toString();
};
