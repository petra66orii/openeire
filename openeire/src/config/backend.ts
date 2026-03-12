const DEFAULT_API_BASE_URL = "/api/";

export const isAbsoluteUrl = (value: string): boolean =>
  value.startsWith("http://") || value.startsWith("https://");

export const normalizeApiBaseUrl = (value?: string): string => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return DEFAULT_API_BASE_URL;
  }

  if (isAbsoluteUrl(trimmed)) {
    return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
  }

  const leadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return leadingSlash.endsWith("/") ? leadingSlash : `${leadingSlash}/`;
};

export const deriveMediaBaseUrl = (
  apiBaseUrl: string,
  explicitMediaBaseUrl?: string,
): string => {
  const explicit = (explicitMediaBaseUrl ?? "").trim();
  if (explicit) {
    if (isAbsoluteUrl(explicit)) {
      return explicit.replace(/\/+$/, "");
    }

    const leadingSlash = explicit.startsWith("/") ? explicit : `/${explicit}`;
    return leadingSlash.replace(/\/+$/, "");
  }

  if (isAbsoluteUrl(apiBaseUrl)) {
    try {
      return new URL(apiBaseUrl).origin;
    } catch {
      return "";
    }
  }

  return "";
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const MEDIA_BASE_URL = deriveMediaBaseUrl(
  API_BASE_URL,
  import.meta.env.VITE_MEDIA_BASE_URL,
);

export const resolveMediaUrl = (
  assetPath?: string | null,
  mediaBaseUrl: string = MEDIA_BASE_URL,
): string | undefined => {
  if (!assetPath) return undefined;
  if (isAbsoluteUrl(assetPath)) return assetPath;

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  if (!mediaBaseUrl) {
    return normalizedPath;
  }

  const normalizedBase = mediaBaseUrl.endsWith("/")
    ? mediaBaseUrl.slice(0, -1)
    : mediaBaseUrl;
  return `${normalizedBase}${normalizedPath}`;
};
