const DEFAULT_API_BASE_URL = "/api/";

const isAbsoluteUrl = (value: string): boolean =>
  value.startsWith("http://") || value.startsWith("https://");

const normalizeApiBaseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_API_BASE_URL;
  }
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
};

export const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
);

export const MEDIA_BASE_URL = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
})();

export const resolveMediaUrl = (assetPath?: string | null): string | undefined => {
  if (!assetPath) return undefined;
  if (isAbsoluteUrl(assetPath)) return assetPath;

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return MEDIA_BASE_URL ? `${MEDIA_BASE_URL}${normalizedPath}` : normalizedPath;
};
