import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  UserProfile,
  updateProfile,
  getCountries,
  Country,
} from "../services/api";
import toast from "react-hot-toast";

interface EditProfileFormProps {
  initialData: UserProfile;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData }) => {
  const { refreshUser } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({
    ...initialData,
    default_country: initialData.default_country || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => toast.error("Could not load countries."));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clean data for Django
    const payload = {
      ...formData,
      country: formData.default_country || null,
      phone_number: formData.default_phone_number || null,
    };

    try {
      await updateProfile(payload);
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* ACCOUNT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="text"
              value={formData.email}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Managed in Security Settings
            </p>
          </div>
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* SHIPPING INFO */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6 mt-10 border-t border-white/10 pt-8">
            Default Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Phone Number</label>
              <input
                type="text"
                name="default_phone_number"
                value={formData.default_phone_number || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line 1</label>
              <input
                type="text"
                name="default_street_address1"
                value={formData.default_street_address1 || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line 2 (Optional)</label>
              <input
                type="text"
                name="default_street_address2"
                value={formData.default_street_address2 || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Town / City</label>
              <input
                type="text"
                name="default_town"
                value={formData.default_town || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>County / State</label>
              <input
                type="text"
                name="default_county"
                value={formData.default_county || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Postcode</label>
              <input
                type="text"
                name="default_postcode"
                value={formData.default_postcode || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <select
                name="default_country"
                value={formData.default_country || ""}
                onChange={handleChange}
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
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
