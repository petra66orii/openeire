import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { ConfirmPaymentData } from "@stripe/stripe-js";
import { UserProfile, getCountries, Country } from "../services/api";
import { useCart } from "../context/CartContext";
import { FaTruck, FaCreditCard, FaBoxOpen } from "react-icons/fa";
import { ShippingDetails } from "../types/checkout";
import {
  CheckoutSuccessContext,
  clearCheckoutSuccessContext,
  writeCheckoutSuccessContext,
} from "../utils/checkoutSuccessContext";

const SHIPPING_METHODS = ["budget", "standard", "express"] as const;
type ShippingMethod = (typeof SHIPPING_METHODS)[number];
type SupportedTransitCountry = "IE" | "US";

const TRANSIT_ESTIMATES: Record<
  SupportedTransitCountry,
  Record<ShippingMethod, string>
> = {
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

interface CheckoutFormProps {
  initialData?: UserProfile | null;
  shippingDetails: ShippingDetails;
  onShippingChange: React.Dispatch<React.SetStateAction<ShippingDetails>>;
  saveInfo: boolean;
  onSaveInfoChange: (save: boolean) => void;
  shippingMethod: string;
  onShippingMethodChange: (method: string) => void;
  isUpdatingIntent?: boolean;
  isPaymentReady?: boolean;
  isAuthenticated?: boolean;
  accountEmail?: string | null;
  successContext: CheckoutSuccessContext;
}

const SHIPPING_FIELD_NAMES: Array<keyof ShippingDetails> = [
  "name",
  "email",
  "phone",
  "line1",
  "line2",
  "city",
  "state",
  "country",
  "postal_code",
];

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  initialData,
  shippingDetails,
  onShippingChange,
  saveInfo,
  onSaveInfoChange,
  shippingMethod,
  onShippingMethodChange,
  isUpdatingIntent,
  isPaymentReady,
  isAuthenticated = false,
  accountEmail,
  successContext,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { hasPhysicalItems } = useCart();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (initialData) {
      const hasExistingInput = SHIPPING_FIELD_NAMES.some(
        (field) => shippingDetails[field].trim().length > 0,
      );
      if (hasExistingInput) return;

      let initialCountry = initialData.default_country || "";

      if (
        hasPhysicalItems &&
        initialCountry !== "IE" &&
        initialCountry !== "US"
      ) {
        initialCountry = "";
      }

      const initialShipping = {
        name: `${initialData.first_name || ""} ${initialData.last_name || ""}`.trim(),
        email: initialData.email || "",
        phone: initialData.default_phone_number || "",
        line1: initialData.default_street_address1 || "",
        line2: initialData.default_street_address2 || "",
        city: initialData.default_town || "",
        state: initialData.default_county || "",
        country: initialCountry,
        postal_code: initialData.default_postcode || "",
      };
      onShippingChange(initialShipping);
    }
  }, [initialData, hasPhysicalItems, onShippingChange, shippingDetails]);

  const syncAutofilledValues = useCallback(() => {
    if (!formRef.current) return;
    onShippingChange((prev) => {
      const nextDetails = { ...prev };
      let changed = false;

      SHIPPING_FIELD_NAMES.forEach((fieldName) => {
        const element = formRef.current?.elements.namedItem(fieldName);
        if (
          !element ||
          !("value" in element) ||
          typeof (element as unknown as HTMLInputElement | HTMLSelectElement)
            .value !== "string"
        ) {
          return;
        }

        const domValue = (
          element as unknown as HTMLInputElement | HTMLSelectElement
        ).value;
        if (domValue !== prev[fieldName]) {
          nextDetails[fieldName] = domValue;
          changed = true;
        }
      });

      return changed ? nextDetails : prev;
    });
  }, [onShippingChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (errorMessage) setErrorMessage(null);
    const fieldName = e.target.name as keyof ShippingDetails;
    const fieldValue = e.target.value;
    onShippingChange((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isPaymentReady) {
      setErrorMessage("Complete shipping details to load payment options.");
      return;
    }
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const confirmParams: ConfirmPaymentData = {
      return_url: `${window.location.origin}/checkout-success`,
      receipt_email: shippingDetails.email,
    };

    if (hasPhysicalItems) {
      confirmParams.shipping = {
        name: shippingDetails.name,
        phone: shippingDetails.phone,
        address: {
          line1: shippingDetails.line1,
          line2: shippingDetails.line2,
          city: shippingDetails.city,
          state: shippingDetails.state,
          country: shippingDetails.country,
          postal_code: shippingDetails.postal_code,
        },
      };
    }

    try {
      writeCheckoutSuccessContext(successContext);
    } catch (storageError) {
      console.warn("Could not persist checkout success context", storageError);
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams,
    });

    if (error) {
      try {
        clearCheckoutSuccessContext();
      } catch (storageError) {
        console.warn("Could not clear checkout success context", storageError);
      }
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const displayedCountries = hasPhysicalItems
    ? countries.filter((c) => c.code === "IE" || c.code === "US")
    : countries;

  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-4 text-white placeholder-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";
  const requiresState = hasPhysicalItems && shippingDetails.country === "US";
  const selectedTransitCountry =
    shippingDetails.country === "IE" || shippingDetails.country === "US"
      ? shippingDetails.country
      : null;
  const shouldLockAccountEmail = Boolean(isAuthenticated && accountEmail);

  const getTransitEstimate = (method: ShippingMethod) => {
    if (!selectedTransitCountry) {
      return "Select country for estimate";
    }
    return TRANSIT_ESTIMATES[selectedTransitCountry][method];
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onBlurCapture={syncAutofilledValues}
      className="space-y-8"
    >
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <FaTruck className="text-accent" />
          <h2 className="text-xl font-serif font-bold text-white">
            {hasPhysicalItems ? "Shipping Details" : "Contact Details"}
          </h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="name"
                value={shippingDetails.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                autoComplete="name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                value={shippingDetails.email}
                onChange={handleChange}
                placeholder="john@example.com"
                type="email"
                required
                autoComplete="email"
                readOnly={shouldLockAccountEmail}
                aria-readonly={shouldLockAccountEmail}
                className={`${inputClass} ${shouldLockAccountEmail ? "cursor-not-allowed opacity-80" : ""}`}
              />
              {shouldLockAccountEmail && accountEmail && (
                <p className="text-xs text-gray-500 mt-2">
                  Signed-in purchases use your account email: {accountEmail}
                </p>
              )}
            </div>
          </div>

          {hasPhysicalItems ? (
            <>
              <div>
                <label className={labelClass}>Address Line 1</label>
                <input
                  name="line1"
                  value={shippingDetails.line1}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                  autoComplete="address-line1"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleChange}
                    placeholder="Dublin"
                    required
                    autoComplete="address-level2"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input
                    name="postal_code"
                    value={shippingDetails.postal_code}
                    onChange={handleChange}
                    placeholder={
                      shippingDetails.country === "US" ? "12345" : "D01 X123"
                    }
                    required
                    autoComplete="postal-code"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Country</label>
                  <select
                    name="country"
                    value={shippingDetails.country}
                    onChange={handleChange}
                    required
                    autoComplete="country"
                    className={inputClass}
                  >
                    <option value="">Select Country</option>
                    {displayedCountries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    {requiresState ? "State" : "County / Region"}
                  </label>
                  <input
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleChange}
                    placeholder={requiresState ? "California" : "Dublin"}
                    required={requiresState}
                    autoComplete="address-level1"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleChange}
                  placeholder="+353 1 234 5678"
                  required
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {hasPhysicalItems && (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <FaBoxOpen className="text-accent" />
            <h2 className="text-xl font-serif font-bold text-white">
              Shipping Method
            </h2>
          </div>
          <div className="space-y-4">
            {SHIPPING_METHODS.map((method) => {
              const isSelected = shippingMethod === method;
              return (
                <label
                  key={method}
                  className={`flex items-start justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-white/10 bg-black hover:bg-white/5"
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-wide">
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
                    onChange={(e) => onShippingMethodChange(e.target.value)}
                    className="mt-1 h-4 w-4 accent-brand-500"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <FaCreditCard className="text-accent" />
          <h2 className="text-xl font-serif font-bold text-white">
            Payment
          </h2>
        </div>

        <PaymentElement />

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex items-start gap-3">
          <input
            type="checkbox"
            id="saveInfo"
            checked={saveInfo}
            onChange={(e) => onSaveInfoChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-brand-500 focus:ring-brand-500"
          />
          <label htmlFor="saveInfo" className="text-sm text-gray-400">
            Save this information for next time.
          </label>
        </div>

        <button
          type="submit"
          disabled={!stripe || isLoading || Boolean(isUpdatingIntent) || !isPaymentReady}
          className="mt-8 w-full rounded-xl bg-brand-500 px-8 py-4 font-bold text-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Processing..."
            : isUpdatingIntent
              ? "Refreshing total..."
              : "Complete Order"}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
