const normalizeEnvValue = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
  return trimmed;
};

const parseThreshold = (value: string | undefined): number => {
  const parsed = Number.parseFloat(normalizeEnvValue(value) ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 180;
};

const parseCountries = (value: string | undefined): string[] => {
  const configured = normalizeEnvValue(value) ?? "IE";
  return configured
    .split(",")
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean);
};

export const FREE_SHIPPING_PROMO_ENABLED =
  normalizeEnvValue(process.env.NEXT_PUBLIC_FREE_SHIPPING_ENABLED) !== "false";

export const FREE_SHIPPING_THRESHOLD = parseThreshold(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD,
);

export const FREE_SHIPPING_ELIGIBLE_COUNTRIES = parseCountries(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_ELIGIBLE_COUNTRIES,
);

export const FREE_SHIPPING_COUNTRY_LABEL =
  normalizeEnvValue(process.env.NEXT_PUBLIC_FREE_SHIPPING_COUNTRY_LABEL) ??
  "Ireland";

export const formatFreeShippingThreshold = () =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(FREE_SHIPPING_THRESHOLD);

export const isFreeShippingCountryEligible = (countryCode?: string | null) =>
  Boolean(
    countryCode &&
      FREE_SHIPPING_ELIGIBLE_COUNTRIES.includes(countryCode.toUpperCase()),
  );
