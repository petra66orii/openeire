"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FaLockOpen } from "react-icons/fa";
import {
  confirmPasswordReset,
  normalizeAuthErrorMessage,
} from "@/lib/api/auth";

export function PasswordResetConfirmForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("No reset token found.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await confirmPasswordReset({
        password,
        confirm_password: confirmPassword,
        token,
      });
      setMessage(response.message);
      window.setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      setError(normalizeAuthErrorMessage(err, "An error occurred."));
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent";
  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

  return (
    <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
          <FaLockOpen className="text-xl text-accent" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          New Password
        </h1>
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
          <label htmlFor="new-password" className={labelClass}>
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-3 font-bold text-brand-900 transition-colors hover:bg-white disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
