import React, { useState } from "react";
import { changePassword } from "../services/api";
import { toast } from "react-toastify";

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
      toast.success(response.message);
      // Reset form
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      const errorMsg =
        err.old_password?.[0] ||
        err.new_password?.[0] ||
        "Failed to change password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
      <div>
        <label
          htmlFor="old_password"
          className="block text-sm font-medium text-gray-700"
        >
          Old Password
        </label>
        <input
          type="password"
          name="old_password"
          id="old_password"
          value={formData.old_password}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label
          htmlFor="new_password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          type="password"
          name="new_password"
          id="new_password"
          value={formData.new_password}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label
          htmlFor="confirm_password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <button type="submit" className="btn-primary w-auto" disabled={loading}>
        {loading ? "Saving..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
