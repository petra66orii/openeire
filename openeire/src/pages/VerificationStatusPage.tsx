import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../services/api";
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import { getRequestedGalleryEmail } from "../utils/galleryAccessFlow";

type Status = "verifying" | "success" | "error";

const VerificationStatusPage: React.FC = () => {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState<string>("Verifying your account...");
  const { token } = useParams<{ token: string }>();
  const requestedGalleryEmail = useMemo(() => getRequestedGalleryEmail(), []);
  const isGalleryIntent = Boolean(requestedGalleryEmail);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    const handleVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully.");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.error || "Verification failed. The link may have expired.",
        );
      }
    };

    handleVerification();
  }, [token]);

  return (
    <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black p-4">
      <SEOHead
        title="Email Verification"
        description="Confirm your OpenÉire Studios email verification link."
        canonicalPath="/verify-email/confirm"
        noindex
      />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-10 text-center shadow-2xl animate-fade-in-up">
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <FaSpinner className="mb-6 animate-spin text-4xl text-accent" />
            <h1 className="mb-2 text-2xl font-serif font-bold text-white">
              Verifying...
            </h1>
            <p className="text-sm text-gray-400">
              Please wait while we secure your account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-serif font-bold text-white">
              Verified
            </h1>
            <p className="mb-6 text-gray-400">{message}</p>

            {isGalleryIntent && (
              <div className="mb-8 w-full rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
                Your account is ready. Sign in with{" "}
                <span className="font-semibold text-white">
                  {requestedGalleryEmail}
                </span>{" "}
                and we&apos;ll take you back to the gallery gate to enter your
                access code.
              </div>
            )}

            <Link
              to="/login"
              state={{
                from: { pathname: isGalleryIntent ? "/gallery-gate" : "/profile" },
                prefillEmail: requestedGalleryEmail || undefined,
                fromGalleryGate: isGalleryIntent,
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 font-bold text-paper shadow-lg transition-all hover:bg-brand-700 active:scale-95"
            >
              {isGalleryIntent ? "Sign In to Continue" : "Go to Login"}{" "}
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <FaTimesCircle className="text-4xl text-red-500" />
            </div>
            <h1 className="mb-2 text-2xl font-serif font-bold text-white">
              Verification Failed
            </h1>
            <p className="mb-8 w-full rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-sm text-red-400/80">
              {message}
            </p>

            <Link
              to="/contact"
              className="text-sm text-gray-400 underline hover:text-white"
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatusPage;
