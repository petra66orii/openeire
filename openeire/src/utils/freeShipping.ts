const parseEnvNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const FREE_SHIPPING_PROMO_ENABLED =
  import.meta.env.VITE_FREE_SHIPPING_ENABLED === "true";

export const FREE_SHIPPING_THRESHOLD = parseEnvNumber(
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD,
  150,
);

export const FREE_SHIPPING_ELIGIBLE_COUNTRIES = (
  import.meta.env.VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES || "IE"
)
  .split(",")
  .map((value) => value.trim().toUpperCase())
  .filter(Boolean);

export const FREE_SHIPPING_COUNTRY_LABEL =
  import.meta.env.VITE_FREE_SHIPPING_COUNTRY_LABEL || "Ireland";

export const isFreeShippingCountryEligible = (
  countryCode?: string | null,
): boolean => {
  if (!FREE_SHIPPING_ELIGIBLE_COUNTRIES.length) return false;
  if (!countryCode) return true;
  return FREE_SHIPPING_ELIGIBLE_COUNTRIES.includes(countryCode.trim().toUpperCase());
};
