import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { UserProfile, getCountries, Country } from "../services/api";
import { FaTruck, FaCreditCard } from "react-icons/fa";

interface CheckoutFormProps {
  initialData?: UserProfile | null;
  onShippingChange: (details: any) => void;
  onSaveInfoChange: (save: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  initialData,
  onShippingChange,
  onSaveInfoChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveInfo, setSaveInfo] = useState(true);

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  // 1. Fetch Countries
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

  // 2. Load User Data
  useEffect(() => {
    if (initialData) {
      const initialShipping = {
        name: `${initialData.first_name || ""} ${initialData.last_name || ""}`.trim(),
        email: initialData.email || "",
        phone: initialData.default_phone_number || "",
        line1: initialData.default_street_address1 || "",
        line2: initialData.default_street_address2 || "",
        city: initialData.default_town || "",
        state: initialData.default_county || "",
        country: initialData.default_country || "",
        postal_code: initialData.default_postcode || "",
      };
      setShippingDetails(initialShipping);
      onShippingChange(initialShipping);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const newDetails = { ...shippingDetails, [e.target.name]: e.target.value };
    setShippingDetails(newDetails);
    onShippingChange(newDetails);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
        receipt_email: shippingDetails.email,
        shipping: {
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
        },
      },
    });

    if (error)
      setErrorMessage(error.message || "An unexpected error occurred.");
    setIsLoading(false);
  };

  // Reusable Input Styles
  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-4 text-white placeholder-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. SHIPPING SECTION */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <FaTruck className="text-accent" />
          <h2 className="text-xl font-serif font-bold text-white">
            Shipping Details
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
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Address Line 1</label>
            <input
              name="line1"
              value={shippingDetails.line1}
              onChange={handleChange}
              placeholder="123 Main St"
              required
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
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                name="postal_code"
                value={shippingDetails.postal_code}
                onChange={handleChange}
                placeholder="D01 X123"
                required
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
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Select Country...</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                name="phone"
                value={shippingDetails.phone}
                onChange={handleChange}
                placeholder="+353..."
                type="tel"
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PAYMENT SECTION */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <FaCreditCard className="text-accent" />
          <h2 className="text-xl font-serif font-bold text-white">
            Payment Method
          </h2>
        </div>

        {/* Stripe Element injects here (Themed via CheckoutPage options) */}
        <div className="min-h-[200px]">
          <PaymentElement />
        </div>

        {initialData && (
          <div className="flex items-center mt-6 p-4 bg-black/40 rounded-lg border border-white/5">
            <input
              type="checkbox"
              id="save-info"
              checked={saveInfo}
              onChange={(e) => {
                setSaveInfo(e.target.checked);
                onSaveInfoChange(e.target.checked);
              }}
              className="h-5 w-5 text-accent bg-black border-white/30 rounded focus:ring-accent focus:ring-offset-0 cursor-pointer"
            />
            <label
              htmlFor="save-info"
              className="ml-3 block text-sm text-gray-400 cursor-pointer select-none"
            >
              Save shipping information for future purchases
            </label>
          </div>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-bold">
          {errorMessage}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full py-5 bg-brand-700 hover:bg-brand-900 text-paper font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,196,0,0.3)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
            Processing...
          </div>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
