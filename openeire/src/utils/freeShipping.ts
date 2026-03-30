const normalizeEnvValue = (value: string | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined;

  const normalized = value.trim();
  if (!normalized) return undefined;
  if (normalized.toLowerCase() === "undefined") return undefined;
  if (normalized.toLowerCase() === "null") return undefined;

  return normalized;
};

const parseEnvNumber = (value: string | undefined, fallback: number): number => {
  const normalized = normalizeEnvValue(value);
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const FREE_SHIPPING_PROMO_ENABLED =
  normalizeEnvValue(import.meta.env.VITE_FREE_SHIPPING_ENABLED) === "true";

export const FREE_SHIPPING_THRESHOLD = parseEnvNumber(
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD,
  150,
);

export const FREE_SHIPPING_ELIGIBLE_COUNTRIES = (
  normalizeEnvValue(import.meta.env.VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES) || "IE"
)
  .split(",")
  .map((value) => value.trim().toUpperCase())
  .filter(Boolean);

export const FREE_SHIPPING_COUNTRY_LABEL =
  normalizeEnvValue(import.meta.env.VITE_FREE_SHIPPING_COUNTRY_LABEL) || "Ireland";

export const isFreeShippingCountryEligible = (
  countryCode?: string | null,
): boolean => {
  if (!FREE_SHIPPING_ELIGIBLE_COUNTRIES.length) return false;
  if (!countryCode || !countryCode.trim()) return false;

  return FREE_SHIPPING_ELIGIBLE_COUNTRIES.includes(
    countryCode.trim().toUpperCase(),
  );
};