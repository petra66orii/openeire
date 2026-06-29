export const DEFAULT_API_BASE_URL = "https://api.openeire.ie/api/";

export const isAbsoluteUrl = (value: string): boolean =>
  value.startsWith("http://") || value.startsWith("https://");

export const normalizeApiBaseUrl = (value?: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULT_API_BASE_URL;
  if (isAbsoluteUrl(trimmed)) return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;

  const leadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return leadingSlash.endsWith("/") ? leadingSlash : `${leadingSlash}/`;
};

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL,
);

export const getApiBaseUrlForRequest = (): string => {
  if (isAbsoluteUrl(API_BASE_URL)) return API_BASE_URL;

  // Server-rendered pages cannot use browser-relative API paths. If Render is
  // missing/misconfigures NEXT_PUBLIC_API_BASE_URL, keep public SSR fetches on
  // the production API instead of accidentally resolving /api/ against Next.
  if (typeof window === "undefined") return DEFAULT_API_BASE_URL;

  return API_BASE_URL;
};
