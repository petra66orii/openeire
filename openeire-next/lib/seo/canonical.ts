import { buildAbsoluteUrl } from "@/lib/site";

export const normalizePath = (path = "/"): string => {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
};

export const buildCanonicalUrl = (path = "/"): string =>
  buildAbsoluteUrl(normalizePath(path));
