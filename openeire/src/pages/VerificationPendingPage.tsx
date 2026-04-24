import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";
import SEOHead from "../components/SEOHead";

type VerificationPendingState =
  | {
      email?: string;
      fromGalleryGate?: boolean;
      from?: { pathname?: string };
    }
  | undefined;

const VerificationPendingPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as VerificationPendingState;
  const isGalleryIntent = Boolean(state?.fromGalleryGate);
  const email = state?.email;

  return (
    <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black p-4">
      <SEOHead
        title="Verify Your Email"
        description="Check your inbox to verify your OpenÉire Studios account."
        canonicalPath="/verify-pending"
        noindex
      />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-2xl animate-fade-in-up">
        <div className="group relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <div className="absolute inset-0 rounded-full bg-accent/20 opacity-20 animate-ping"></div>
          <FaEnvelopeOpenText className="relative z-10 text-4xl text-accent" />
        </div>

        <h1 className="mb-4 text-3xl font-serif font-bold text-white">
          Verify Your Email
        </h1>

        <p className="mb-6 leading-relaxed text-gray-400">
          {isGalleryIntent
            ? "We’ve sent a secure verification link so you can finish setting up your account and unlock the private gallery."
            : "Thank you for registering. We have sent a secure verification link to your email address. Please click the link to activate your account."}
        </p>

        {email && (
          <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-brand-100">
            Sent to <span className="font-semibold text-white">{email}</span>
          </div>
        )}

        {isGalleryIntent && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
            After verifying, sign in with this same email and we&apos;ll take
            you back to the gallery gate to enter your access code.
          </div>
        )}

        <div className="rounded-lg border border-white/5 bg-black/40 p-4 text-xs text-gray-500">
          <p>
            Didn&apos;t receive an email? Check your spam folder or{" "}
            <button className="font-bold text-accent hover:underline">
              contact support
            </button>
            .
          </p>
        </div>

        {isGalleryIntent && (
          <div className="mt-6 text-sm text-gray-400">
            Already verified?{" "}
            <Link
              to="/login"
              state={{
                from: { pathname: "/gallery-gate" },
                prefillEmail: email,
                fromGalleryGate: true,
              }}
              className="font-semibold text-white hover:text-accent"
            >
              Sign in and continue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPendingPage;
