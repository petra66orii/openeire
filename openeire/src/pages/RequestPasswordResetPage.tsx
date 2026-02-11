import React, { useState } from "react";
import { requestPasswordReset } from "../services/api";
import { FaKey } from "react-icons/fa";

const RequestPasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (err: any) {
      setError(err.email?.[0] || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaKey className="text-accent text-xl" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Reset Password
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Enter your email to receive reset instructions.
          </p>
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
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;
