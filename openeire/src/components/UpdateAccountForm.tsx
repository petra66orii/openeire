import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserProfile, updateProfile } from "../services/api";
import { toast } from "react-toastify";

interface UpdateAccountFormProps {
  profile: UserProfile;
}

const UpdateAccountForm: React.FC<UpdateAccountFormProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
  });
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth(); // Get logout to force re-login after email/username change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.username === profile.username &&
      formData.email === profile.email
    ) {
      toast.info("No changes to save.");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Account details updated. Please log in again.");
      logout(); // Force logout for security and to refresh token with new details
    } catch (err: any) {
      const errorMsg =
        err.username?.[0] || err.email?.[0] || "Failed to update details.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Account Details</h3>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <button type="submit" className="btn-primary w-auto" disabled={loading}>
        {loading ? "Saving..." : "Save Account Details"}
      </button>
    </form>
  );
};

export default UpdateAccountForm;
