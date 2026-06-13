import { PUBLIC_IMAGES } from "@/lib/assets";

export const SITE_NAME = "Open\u00c9ire Studios";
export const SITE_NAME_ASCII = "OpenEire Studios";
export const SITE_DESCRIPTION =
  "Premium aerial photography, fine art prints, commercial licensing, and curated visual assets from Ireland.";
export const SITE_CONTACT_EMAIL = "studio@openeire.ie";
export const DEFAULT_SOCIAL_IMAGE_PATH = PUBLIC_IMAGES.heroPoster;
export const ORGANIZATION_LOGO_PATH = PUBLIC_IMAGES.organizationLogo;

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
