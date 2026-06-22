"use client";

import type { Country } from "@/types/auth";
import type { CheckoutShippingDetails, ShippingMethod } from "@/types/checkout";

interface CheckoutShippingFormProps {
  value: CheckoutShippingDetails;
  onChange: (value: CheckoutShippingDetails) => void;
  shippingMethod: ShippingMethod;
  onShippingMethodChange: (value: ShippingMethod) => void;
  countries: Country[];
  isLoadingCountries: boolean;
  countriesError: string | null;
}

const SHIPPING_METHODS: ShippingMethod[] = ["budget", "standard", "express"];

const TRANSIT_ESTIMATES: Record<"IE" | "US", Record<ShippingMethod, string>> = {
  IE: {
    budget: "Estimated: Slower than Standard postal service",
    standard: "Estimated: 5-7 working days",
    express: "Estimated: 1-6 working days",
  },
  US: {
    budget: "Estimated: Slower than Standard postal service",
    standard: "Estimated: 4-6 working days",
    express: "Estimated: 1-6 working days",
  },
};

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-4 text-white outline-none transition-all placeholder:text-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

export function CheckoutShippingForm({
  value,
  onChange,
  shippingMethod,
  onShippingMethodChange,
  countries,
  isLoadingCountries,
  countriesError,
}: CheckoutShippingFormProps) {
  const updateField = (
    field: keyof CheckoutShippingDetails,
    nextValue: string,
  ) => {
    onChange({ ...value, [field]: nextValue });
  };

  const displayedCountries = countries.filter(
    (country) => country.code === "IE" || country.code === "US",
  );
  const requiresState = value.country === "US";
  const transitCountry =
    value.country === "IE" || value.country === "US" ? value.country : null;

  const getTransitEstimate = (method: ShippingMethod) => {
    if (!transitCountry) return "Select country for estimate";
    return TRANSIT_ESTIMATES[transitCountry][method];
  };

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8">
        <div className="mb-6 border-b border-white/10 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Delivery
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-white">
            Shipping Details
          </h2>
        </div>

        {countriesError ? (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-300">
            {countriesError}
          </div>
        ) : null}

        <div className="space-y-5">
          <div>
            <label htmlFor="checkout-line1" className={labelClass}>
              Address Line 1
            </label>
            <input
              id="checkout-line1"
              name="line1"
              value={value.line1}
              onChange={(event) => updateField("line1", event.target.value)}
              autoComplete="address-line1"
              className={inputClass}
              placeholder="123 Main St"
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-line2" className={labelClass}>
              Address Line 2
            </label>
            <input
              id="checkout-line2"
              name="line2"
              value={value.line2}
              onChange={(event) => updateField("line2", event.target.value)}
              autoComplete="address-line2"
              className={inputClass}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="checkout-city" className={labelClass}>
                City
              </label>
              <input
                id="checkout-city"
                name="city"
                value={value.city}
                onChange={(event) => updateField("city", event.target.value)}
                autoComplete="address-level2"
                className={inputClass}
                placeholder="Dublin"
                required
              />
            </div>

            <div>
              <label htmlFor="checkout-postal-code" className={labelClass}>
                Postal Code
              </label>
              <input
                id="checkout-postal-code"
                name="postal_code"
                value={value.postal_code}
                onChange={(event) =>
                  updateField("postal_code", event.target.value)
                }
                autoComplete="postal-code"
                className={inputClass}
                placeholder={value.country === "US" ? "12345" : "D01 X123"}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="checkout-country" className={labelClass}>
                Country
              </label>
              <select
                id="checkout-country"
                name="country"
                value={value.country}
                onChange={(event) => updateField("country", event.target.value)}
                autoComplete="country"
                className={inputClass}
                disabled={isLoadingCountries}
                required
              >
                <option value="">
                  {isLoadingCountries ? "Loading countries..." : "Select Country"}
                </option>
                {displayedCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="checkout-state" className={labelClass}>
                {requiresState ? "State" : "County / Region"}
              </label>
              <input
                id="checkout-state"
                name="state"
                value={value.state}
                onChange={(event) => updateField("state", event.target.value)}
                autoComplete="address-level1"
                className={inputClass}
                placeholder={requiresState ? "California" : "Dublin"}
                required={requiresState}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8">
        <div className="mb-6 border-b border-white/10 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Fulfilment
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-white">
            Shipping Method
          </h2>
        </div>

        <div className="space-y-4">
          {SHIPPING_METHODS.map((method) => {
            const isSelected = shippingMethod === method;
            return (
              <label
                key={method}
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-white/10 bg-black hover:bg-white/5"
                }`}
              >
                <div>
                  <div className="text-sm font-bold uppercase tracking-wide text-white">
                    {method}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {getTransitEstimate(method)}
                  </div>
                </div>
                <input
                  type="radio"
                  name="shipping_method"
                  value={method}
                  checked={isSelected}
                  onChange={(event) =>
                    onShippingMethodChange(event.target.value as ShippingMethod)
                  }
                  className="mt-1 h-4 w-4 accent-brand-500"
                />
              </label>
            );
          })}
        </div>
      </section>
    </>
  );
}

