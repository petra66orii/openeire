import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../services/api";
import { FaLockOpen } from "react-icons/fa";

const ConfirmPasswordResetPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("No reset token found.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await confirmPasswordReset(
        password,
        confirmPassword,
        token,
      );
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.password?.[0] || err.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLockOpen className="text-accent text-xl" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            New Password
          </h1>
        </div>

        {message && (
          <div className="p-3 mb-4 text-sm text-green-400 bg-green-900/20 border border-green-500/20 rounded-lg text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className={labelClass}>
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-brand-900 font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Reseting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmPasswordResetPage;
