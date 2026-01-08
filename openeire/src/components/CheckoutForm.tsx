import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { UserProfile, getCountries, Country } from "../services/api";

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

  // State for the dynamic country list
  const [countries, setCountries] = useState<Country[]>([]);

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "", // Default empty, user must select
    postal_code: "",
  });

  const [saveInfo, setSaveInfo] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Countries on Mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };
    fetchCountries();
  }, []);

  // 2. Load initial User Data
  useEffect(() => {
    if (initialData) {
      const initialShipping = {
        name: `${initialData.first_name || ""} ${
          initialData.last_name || ""
        }`.trim(),
        email: initialData.email || "",
        phone: initialData.default_phone_number || "",
        line1: initialData.default_street_address1 || "",
        line2: initialData.default_street_address2 || "",
        city: initialData.default_town || "",
        state: initialData.default_county || "",
        country: initialData.default_country || "", // Use saved country code
        postal_code: initialData.default_postcode || "",
      };
      setShippingDetails(initialShipping);
      onShippingChange(initialShipping);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newDetails = { ...shippingDetails, [e.target.name]: e.target.value };
    setShippingDetails(newDetails);
    onShippingChange(newDetails);
  };

  const handleSaveInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveInfo(e.target.checked);
    onSaveInfoChange(e.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Confirm Payment
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
            country: shippingDetails.country, // Sends the code (e.g., "IE")
            postal_code: shippingDetails.postal_code,
          },
        },
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "An unexpected error occurred.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="space-y-4">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={shippingDetails.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
            <input
              name="email"
              value={shippingDetails.email}
              onChange={handleChange}
              placeholder="Email Address"
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Phone */}
          <input
            name="phone"
            value={shippingDetails.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            type="tel"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
          />

          <input
            name="line1"
            value={shippingDetails.line1}
            onChange={handleChange}
            placeholder="Address Line 1"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
          />

          <input
            name="line2"
            value={shippingDetails.line2}
            onChange={handleChange}
            placeholder="Address Line 2 (Optional)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="city"
              value={shippingDetails.city}
              onChange={handleChange}
              placeholder="City/Town"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
            <input
              name="state"
              value={shippingDetails.state}
              onChange={handleChange}
              placeholder="County/State"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="postal_code"
              value={shippingDetails.postal_code}
              onChange={handleChange}
              placeholder="Postal Code"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />

            <select
              name="country"
              value={shippingDetails.country}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="">Select Country...</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentElement />

        {initialData && (
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="save-info"
              checked={saveInfo}
              onChange={handleSaveInfoChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label
              htmlFor="save-info"
              className="ml-2 block text-sm text-gray-700"
            >
              Save this information for future purchases
            </label>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {errorMessage}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium 
          ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }
          transition-colors duration-200`}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
