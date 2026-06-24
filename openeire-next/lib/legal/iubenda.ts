const DEFAULT_POLICY_URL = "https://www.iubenda.com/privacy-policy/77203310";

const getSafePublicUrl = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

export const IUBENDA_POLICY_URL =
  getSafePublicUrl(process.env.NEXT_PUBLIC_IUBENDA_POLICY_URL) ??
  DEFAULT_POLICY_URL;

export const IUBENDA_POLICY_EMBED_URL =
  getSafePublicUrl(process.env.NEXT_PUBLIC_IUBENDA_POLICY_EMBED_URL) ??
  `${IUBENDA_POLICY_URL}/legal`;
