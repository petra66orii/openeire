import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface FormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Registration successful! Please check your email.");
      navigate("/verify-pending");
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMsg = "Registration failed. Please check your details.";

      if (err && typeof err === "object" && !Array.isArray(err)) {
        const errorKeys = Object.keys(err);
        if (errorKeys.length > 0 && Array.isArray(err[errorKeys[0]])) {
          errorMsg = `${errorKeys[0]}: ${err[errorKeys[0]][0]}`;
        }
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-gray-600";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label htmlFor="first_name" className={labelClass}>
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            value={formData.first_name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Jane"
          />
        </div>
        <div className="w-full">
          <label htmlFor="last_name" className={labelClass}>
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            value={formData.last_name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="username" className={labelClass}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          className={inputClass}
          placeholder="janedoe"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default AuthForm;
