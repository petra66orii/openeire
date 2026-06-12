const DEFAULT_API_BASE_URL = "/api/";

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
