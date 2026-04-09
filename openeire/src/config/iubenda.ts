const getSafeEnvValue = (value: string | undefined): string | null => {
  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "undefined" || trimmedValue === "null") {
    return null;
  }
  return trimmedValue;
};

const DEFAULT_POLICY_URL = "https://www.iubenda.com/privacy-policy/77203310";

export const IUBENDA_POLICY_URL =
  getSafeEnvValue(import.meta.env.VITE_IUBENDA_POLICY_URL) ?? DEFAULT_POLICY_URL;

export const IUBENDA_POLICY_EMBED_URL =
  getSafeEnvValue(import.meta.env.VITE_IUBENDA_POLICY_EMBED_URL) ??
  `${IUBENDA_POLICY_URL}/legal`;

export const IUBENDA_CONSENT_PUBLIC_API_KEY = getSafeEnvValue(
  import.meta.env.VITE_IUBENDA_CONSENT_PUBLIC_API_KEY,
);

export const IUBENDA_CONSENT_DATABASE_ENABLED = Boolean(
  IUBENDA_CONSENT_PUBLIC_API_KEY,
);
