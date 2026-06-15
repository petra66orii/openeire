import { API_BASE_URL, isAbsoluteUrl } from "@/lib/api/config";

const deriveMediaBaseUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
  if (explicit) {
    if (isAbsoluteUrl(explicit)) return explicit.replace(/\/+$/, "");
    return `/${explicit.replace(/^\/+|\/+$/g, "")}`;
  }

  if (isAbsoluteUrl(API_BASE_URL)) {
    try {
      return new URL(API_BASE_URL).origin;
    } catch {
      return "";
    }
  }

  return "";
};

export const resolveMediaUrl = (
  assetPath?: string | null,
): string | undefined => {
  if (!assetPath) return undefined;
  if (isAbsoluteUrl(assetPath)) return assetPath;

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  const mediaBaseUrl = deriveMediaBaseUrl();
  if (!mediaBaseUrl) return normalizedPath;

  return `${mediaBaseUrl}${normalizedPath}`;
};
