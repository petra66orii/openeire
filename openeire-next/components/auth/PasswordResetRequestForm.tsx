"use client";

import { useState, type FormEvent } from "react";
import { FaKey } from "react-icons/fa";
import { requestPasswordReset, normalizeAuthErrorMessage } from "@/lib/api/auth";

export function PasswordResetRequestForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await requestPasswordReset({ email });
      setMessage(response.message);
    } catch (err) {
      setError(
        normalizeAuthErrorMessage(
          err,
          "An error occurred. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
          <FaKey className="text-xl text-accent" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Enter your email to receive reset instructions.
        </p>
      </div>

      {message ? (
        <div className="mb-4 rounded-lg border border-green-500/20 bg-green-900/20 p-3 text-center text-sm text-green-400">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-900/20 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="password-reset-email"
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500"
          >
            Email Address
          </label>
          <input
            id="password-reset-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-500 py-3 font-bold text-paper transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
