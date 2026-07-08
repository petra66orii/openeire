const DEFAULT_POLICY_URL = "https://www.iubenda.com/privacy-policy/30754861";

const getSafePublicUrl = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;

  try {
    const url = new URL(trimmed);
    if (
      url.protocol !== "https:" ||
      (url.hostname !== "iubenda.com" && !url.hostname.endsWith(".iubenda.com"))
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

const getPolicyEmbedUrl = (policyUrl: string | null): string | null => {
  if (!policyUrl) return null;

  const url = new URL(policyUrl);
  url.pathname = url.pathname.replace(/\/legal\/?$/, "");
  url.pathname = `${url.pathname.replace(/\/$/, "")}/legal`;
  return url.toString();
};

export const IUBENDA_POLICY_URL = getSafePublicUrl(
  process.env.NEXT_PUBLIC_IUBENDA_POLICY_URL,
) ?? DEFAULT_POLICY_URL;

export const IUBENDA_POLICY_EMBED_URL = getPolicyEmbedUrl(IUBENDA_POLICY_URL);
