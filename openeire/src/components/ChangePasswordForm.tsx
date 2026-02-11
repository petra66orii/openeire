import React, { useState } from "react";
import { changePassword } from "../services/api";
import toast from "react-hot-toast";

const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      toast.success(response.message || "Password changed successfully!");
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        "Failed to change password. Please check your current password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reusable Styles
  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-xl">
      <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="old_password" className={labelClass}>
            Current Password
          </label>
          <input
            type="password"
            name="old_password"
            id="old_password"
            value={formData.old_password}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="new_password" className={labelClass}>
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              id="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className={labelClass}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
