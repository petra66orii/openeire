import type { Country } from "@/types/auth";

export const SUPPORTED_PHYSICAL_SHIPPING_COUNTRY_CODES = [
  "IE",
  "US",
  "AU",
  "RO",
] as const;

export type SupportedPhysicalShippingCountry =
  (typeof SUPPORTED_PHYSICAL_SHIPPING_COUNTRY_CODES)[number];

export const SUPPORTED_PHYSICAL_SHIPPING_COUNTRY_NAMES =
  "Ireland, the United States, Australia and Romania";

const SUPPORTED_PHYSICAL_SHIPPING_COUNTRY_SET = new Set<string>(
  SUPPORTED_PHYSICAL_SHIPPING_COUNTRY_CODES,
);

export const isSupportedPhysicalShippingCountry = (
  countryCode?: string | null,
): boolean =>
  Boolean(
    countryCode &&
      SUPPORTED_PHYSICAL_SHIPPING_COUNTRY_SET.has(countryCode.toUpperCase()),
  );

export const normalizeSupportedPhysicalShippingCountry = (
  countryCode?: string | null,
): SupportedPhysicalShippingCountry | null => {
  const normalizedCountryCode = countryCode?.toUpperCase();
  switch (normalizedCountryCode) {
    case "IE":
    case "US":
    case "AU":
    case "RO":
      return normalizedCountryCode;
    default:
      return null;
  }
};

export const filterSupportedPhysicalShippingCountries = (
  countries: Country[],
): Country[] =>
  countries.filter((country) =>
    isSupportedPhysicalShippingCountry(country.code),
  );
