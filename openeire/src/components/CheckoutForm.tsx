import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { UserProfile } from "../services/api";

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

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    country: "",
    postal_code: "",
  });

  const [saveInfo, setSaveInfo] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data if available
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
        country: initialData.default_country || "",
        postal_code: initialData.default_postcode || "",
      };
      setShippingDetails(initialShipping);
      onShippingChange(initialShipping);
    }
  }, [initialData]); // Removed onShippingChange from dependency array to prevent loops

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // 1. Set Loading & Clear previous errors
    setIsLoading(true);
    setErrorMessage(null);

    // 2. Trigger Stripe Confirm
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
        shipping: {
          name: shippingDetails.name,
          phone: shippingDetails.phone,
          address: {
            line1: shippingDetails.line1,
            line2: shippingDetails.line2,
            city: shippingDetails.city,
            country: shippingDetails.country || "IE",
            postal_code: shippingDetails.postal_code,
          },
        },
      },
    });

    // 3. Handle Errors (If we reach this line, payment failed or is incomplete)
    if (error) {
      // Show message only for user-correctable errors
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "An unexpected error occurred.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }

    // 4. Stop Loading (Re-enable button)
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="space-y-4">
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
            placeholder="Email"
            type="email"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentElement />

        {/* Save Info Toggle */}
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

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
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
