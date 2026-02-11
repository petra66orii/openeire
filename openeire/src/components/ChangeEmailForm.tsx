import React, { useState } from "react";
import { changeEmail } from "../services/api";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

const ChangeEmailForm: React.FC = () => {
  const [formData, setFormData] = useState({
    new_email: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await changeEmail(formData);
      setStatus("success");
      toast.success("Verification email sent!");
      setFormData({ new_email: "", password: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("idle");
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to update email. Please check your password.";
      toast.error(errorMessage);
    }
  };

  // Reusable Input Styles
  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  if (status === "success") {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-4xl text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Check Your Inbox</h3>
        <p className="text-green-200/80 mb-6">
          We have sent a confirmation link to your new email address. Please
          click it to finalize the change.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-green-400 hover:text-green-300 font-bold uppercase tracking-wider underline transition-colors"
        >
          Update another email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-xl">
      <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">
        Change Email Address
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="new_email" className={labelClass}>
            New Email Address
          </label>
          <input
            type="email"
            name="new_email"
            id="new_email"
            required
            value={formData.new_email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Current Password{" "}
            <span className="text-[10px] text-gray-600 normal-case ml-1">
              (Required)
            </span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 px-4 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {status === "loading" ? "Verifying..." : "Update Email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeEmailForm;
