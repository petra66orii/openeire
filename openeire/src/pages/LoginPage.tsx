import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { resendVerificationEmail } from "../services/api";
import SocialLogin from "../components/SocialLogin";
import SEOHead from "../components/SEOHead";
import {
  getLoginToastErrorMessage,
  getResendVerificationToastErrorMessage,
} from "../utils/toast";
import { getRequestedGalleryEmail } from "../utils/galleryAccessFlow";

type LoginLocationState =
  | {
      from?: { pathname?: string };
      prefillEmail?: string;
      fromGalleryGate?: boolean;
    }
  | undefined;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState;
  const galleryIntentEmail = useMemo(
    () => locationState?.prefillEmail || getRequestedGalleryEmail(),
    [locationState?.prefillEmail],
  );
  const redirectPath =
    locationState?.from?.pathname ||
    (galleryIntentEmail ? "/gallery-gate" : "/profile");
  const isGalleryIntent = redirectPath === "/gallery-gate";

  useEffect(() => {
    if (!galleryIntentEmail) return;
    setEmail((current) => current || galleryIntentEmail);
  }, [galleryIntentEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      toast.error(getLoginToastErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    const toastId = toast.loading("Sending email...");
    try {
      const response = await resendVerificationEmail(email);
      toast.success(response.message, { id: toastId });
    } catch (err: any) {
      toast.error(getResendVerificationToastErrorMessage(err), { id: toastId });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

  return (
    <div className="mobile-page-offset flex min-h-screen flex-col items-center justify-center bg-black p-4 pt-20">
      <SEOHead
        title="Log In"
        description="Sign in to access your OpenÉire Studios account, downloads, and order history."
        canonicalPath="/login"
        noindex
      />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl animate-fade-in-up">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-serif font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-400">
            {isGalleryIntent
              ? "Sign in with the same email you used to request your gallery code."
              : "Sign in to access your gallery and orders."}
          </p>
        </div>

        {isGalleryIntent && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
            <p className="font-semibold text-white">Unlock your private gallery</p>
            <p className="mt-2">
              Use the same email where you received your access code. Once
              you&apos;re signed in, we&apos;ll take you back to the gallery gate
              to enter it.
            </p>
          </div>
        )}

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
              onChange={(e) => setEmail(e.target.value)}
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
                to="/request-password-reset"
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
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder={"\u2022".repeat(8)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-4 py-3 font-bold text-paper shadow-lg transition-all active:scale-[0.98] hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <SocialLogin redirectPath={redirectPath} />

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          <p className="mb-2">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              state={{
                from: { pathname: redirectPath },
                prefillEmail: email || galleryIntentEmail || undefined,
                fromGalleryGate: isGalleryIntent,
              }}
              className="font-bold text-white transition-colors hover:text-brand-500"
            >
              Sign up
            </Link>
          </p>
          <button
            onClick={handleResendVerification}
            className="text-xs text-gray-600 underline hover:text-gray-400"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
