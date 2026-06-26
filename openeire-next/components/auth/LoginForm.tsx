"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth, normalizeAuthErrorMessage } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { resendVerificationEmail } from "@/lib/api/auth";
import { getSafeReturnPath } from "@/lib/auth/redirects";
import { SocialLogin } from "@/components/auth/SocialLogin";

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isAuthLoading, login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectPath = useMemo(
    () => getSafeReturnPath(searchParams.get("next")),
    [searchParams],
  );
  const isGalleryIntent = redirectPath === "/gallery-gate";

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail((current) => current || emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isAuthLoading, redirectPath, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      await login({ username: email, password });
      showToast("Welcome back.", "success");
      router.replace(redirectPath);
    } catch (error) {
      const message = normalizeAuthErrorMessage(
        error,
        "Unable to sign you in right now. Please try again.",
      );
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      showToast("Please enter your email address first.", "error");
      return;
    }
    try {
      const response = await resendVerificationEmail(email);
      showToast(response.message, "success");
    } catch (error) {
      showToast(
        normalizeAuthErrorMessage(
          error,
          "We couldn't resend the verification email. Please try again.",
        ),
        "error",
      );
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-serif text-3xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-400">
          {isGalleryIntent
            ? "Sign in with the same email you used to request your gallery code."
            : "Sign in to access your gallery and orders."}
        </p>
      </div>

      {isGalleryIntent ? (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
          <p className="font-semibold text-white">Unlock your private gallery</p>
          <p className="mt-2">
            Use the same email where you received your access code. Once you&apos;re
            signed in, we&apos;ll take you back to the gallery gate to enter it.
          </p>
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <Link
              href="/request-password-reset"
              className="text-xs text-brand-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="********"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-500 px-4 py-3 font-bold text-paper shadow-lg transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>

      <SocialLogin redirectPath={redirectPath} />

      <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
        <p className="mb-2">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(redirectPath)}${
              email ? `&email=${encodeURIComponent(email)}` : ""
            }`}
            className="font-bold text-white transition-colors hover:text-brand-500"
          >
            Sign up
          </Link>
        </p>
        <button
          type="button"
          onClick={handleResendVerification}
          className="text-xs text-gray-600 underline hover:text-gray-400"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}
