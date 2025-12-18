import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  UserProfile,
  updateProfile,
  getCountries,
  Country,
} from "../services/api";
import { toast } from "react-toastify";

interface EditProfileFormProps {
  initialData: UserProfile;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData }) => {
  const { refreshUser } = useAuth();

  // State for the dynamic country list
  const [countries, setCountries] = useState<Country[]>([]);

  // Initialize form data (ensure no nulls for controlled inputs)
  const [formData, setFormData] = useState({
    ...initialData,
    default_country: initialData.default_country || "",
  });

  const [loading, setLoading] = useState(false);

  // 1. Fetch the country list when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
        toast.error("Could not load country list.");
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 2. Sanitize Data (Django needs null, not empty strings)
    const payload = {
      ...formData,
      country:
        formData.default_country === "" ? null : formData.default_country,
      phone_number:
        formData.default_phone_number === ""
          ? null
          : formData.default_phone_number,
    };

    try {
      await updateProfile(payload);
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      // Handle the specific country error if Django complains
      const errorMsg = err.response?.data?.default_country
        ? `Country Error: ${err.response.data.default_country[0]}`
        : "Failed to update profile. Please check your inputs.";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* --- USER ACCOUNT INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={formData.email}
              disabled
              className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Visit Security tab to change.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- SHIPPING INFO --- */}
        <h3 className="text-lg font-semibold text-gray-700">
          Shipping Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="default_phone_number"
              value={formData.default_phone_number || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              name="default_street_address1"
              value={formData.default_street_address1 || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="default_street_address2"
              value={formData.default_street_address2 || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Town/City
            </label>
            <input
              type="text"
              name="default_town"
              value={formData.default_town || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              County/State
            </label>
            <input
              type="text"
              name="default_county"
              value={formData.default_county || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postcode
            </label>
            <input
              type="text"
              name="default_postcode"
              value={formData.default_postcode || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* 👇 REPLACED TEXT INPUT WITH DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              name="default_country"
              value={formData.default_country || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="">Select a country...</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
