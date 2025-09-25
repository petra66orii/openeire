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
      onShippingChange(initialShipping); // Pass initial data up
    }
  }, [initialData, onShippingChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDetails = { ...shippingDetails, [e.target.name]: e.target.value };
    setShippingDetails(newDetails);
    onShippingChange(newDetails); // Pass changes up
  };

  const handleSaveInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveInfo(e.target.checked);
    onSaveInfoChange(e.target.checked); // Pass changes up
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

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
            country: shippingDetails.country, // Should be a 2-letter country code
            postal_code: shippingDetails.postal_code,
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Shipping Information</h2>
      <input
        name="name"
        value={shippingDetails.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="email"
        value={shippingDetails.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
        required
        className="w-full p-2 border rounded"
      />

      <div className="pt-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <PaymentElement />
      </div>

      {initialData && ( // Only show for logged-in users
        <div className="flex items-center">
          <input
            type="checkbox"
            id="save-info"
            checked={saveInfo}
            onChange={handleSaveInfoChange}
            className="h-4 w-4 rounded"
          />
          <label
            htmlFor="save-info"
            className="ml-2 block text-sm text-gray-900"
          >
            Save this information for future purchases.
          </label>
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        <span>{isLoading ? "Processing..." : "Pay now"}</span>
      </button>
      {errorMessage && (
        <div className="text-red-500 text-center mt-2">{errorMessage}</div>
      )}
    </form>
  );
};

export default CheckoutForm;
