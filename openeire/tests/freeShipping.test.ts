import { describe, expect, it, vi } from "vitest";

const loadFreeShippingModule = async (env: Record<string, string | undefined>) => {
  vi.resetModules();

  const previous = {
    enabled: import.meta.env.VITE_FREE_SHIPPING_ENABLED,
    threshold: import.meta.env.VITE_FREE_SHIPPING_THRESHOLD,
    countries: import.meta.env.VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES,
    countryLabel: import.meta.env.VITE_FREE_SHIPPING_COUNTRY_LABEL,
  };

  import.meta.env.VITE_FREE_SHIPPING_ENABLED = env.VITE_FREE_SHIPPING_ENABLED;
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD = env.VITE_FREE_SHIPPING_THRESHOLD;
  import.meta.env.VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES = env.VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES;
  import.meta.env.VITE_FREE_SHIPPING_COUNTRY_LABEL = env.VITE_FREE_SHIPPING_COUNTRY_LABEL;

  const module = await import("../src/utils/freeShipping");

  import.meta.env.VITE_FREE_SHIPPING_ENABLED = previous.enabled;
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD = previous.threshold;
  import.meta.env.VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES = previous.countries;
  import.meta.env.VITE_FREE_SHIPPING_COUNTRY_LABEL = previous.countryLabel;

  return module;
};

describe("free shipping config", () => {
  it("uses safe defaults when env values are unset", async () => {
    const module = await loadFreeShippingModule({
      VITE_FREE_SHIPPING_ENABLED: undefined,
      VITE_FREE_SHIPPING_THRESHOLD: undefined,
      VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES: undefined,
      VITE_FREE_SHIPPING_COUNTRY_LABEL: undefined,
    });

    expect(module.FREE_SHIPPING_PROMO_ENABLED).toBe(false);
    expect(module.FREE_SHIPPING_THRESHOLD).toBe(150);
    expect(module.FREE_SHIPPING_ELIGIBLE_COUNTRIES).toEqual(["IE"]);
    expect(module.FREE_SHIPPING_COUNTRY_LABEL).toBe("Ireland");
  });

  it("normalizes the eligible country list", async () => {
    const module = await loadFreeShippingModule({
      VITE_FREE_SHIPPING_ENABLED: "true",
      VITE_FREE_SHIPPING_THRESHOLD: "150",
      VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES: " ie, us , ,gb ",
      VITE_FREE_SHIPPING_COUNTRY_LABEL: "Ireland",
    });

    expect(module.FREE_SHIPPING_ELIGIBLE_COUNTRIES).toEqual(["IE", "US", "GB"]);
  });

  it("treats missing country as unknown instead of eligible", async () => {
    const module = await loadFreeShippingModule({
      VITE_FREE_SHIPPING_ENABLED: "true",
      VITE_FREE_SHIPPING_THRESHOLD: "150",
      VITE_FREE_SHIPPING_ELIGIBLE_COUNTRIES: "IE",
      VITE_FREE_SHIPPING_COUNTRY_LABEL: "Ireland",
    });

    expect(module.isFreeShippingCountryEligible(undefined)).toBe(false);
    expect(module.isFreeShippingCountryEligible("")).toBe(false);
    expect(module.isFreeShippingCountryEligible("IE")).toBe(true);
    expect(module.isFreeShippingCountryEligible("US")).toBe(false);
  });
});
