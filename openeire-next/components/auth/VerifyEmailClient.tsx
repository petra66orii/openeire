"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { verifyEmail } from "@/lib/api/auth";
import { getRequestedGalleryEmail } from "@/lib/auth/tokenStorage";

type Status = "verifying" | "success" | "error";

export function VerifyEmailClient({ token }: { token?: string }) {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Verifying your account...");
  const [requestedGalleryEmail, setRequestedGalleryEmail] = useState("");
  const isGalleryIntent = Boolean(requestedGalleryEmail);

  useEffect(() => {
    setRequestedGalleryEmail(getRequestedGalleryEmail());
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    let isMounted = true;
    verifyEmail({ token })
      .then((response) => {
        if (!isMounted) return;
        setStatus("success");
        setMessage(response.message || "Email verified successfully.");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        const record = error as { error?: string; message?: string; detail?: string };
        setStatus("error");
        setMessage(
          record.error ||
            record.message ||
            record.detail ||
            "Verification failed. The link may have expired.",
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-10 text-center shadow-2xl">
      {status === "verifying" ? (
        <div className="flex flex-col items-center">
          <FaSpinner className="mb-6 animate-spin text-4xl text-accent" />
          <h1 className="mb-2 font-serif text-2xl font-bold text-white">
            Verifying...
          </h1>
          <p className="text-sm text-gray-400">
            Please wait while we secure your account.
          </p>
        </div>
      ) : null}

      {status === "success" ? (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-white">
            Verified
          </h1>
          <p className="mb-6 text-gray-400">{message}</p>
          {isGalleryIntent ? (
            <div className="mb-8 w-full rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
              Your account is ready. Sign in with{" "}
              <span className="font-semibold text-white">
                {requestedGalleryEmail}
              </span>{" "}
              and we&apos;ll take you back to the gallery gate to enter your
              access code.
            </div>
          ) : null}
          <Link
            href={`/login?next=${encodeURIComponent(
              isGalleryIntent ? "/gallery-gate" : "/profile",
            )}${
              requestedGalleryEmail
                ? `&email=${encodeURIComponent(requestedGalleryEmail)}`
                : ""
            }`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 font-bold text-paper shadow-lg transition-all hover:bg-brand-700 active:scale-95"
          >
            {isGalleryIntent ? "Sign In to Continue" : "Go to Login"}{" "}
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <FaTimesCircle className="text-4xl text-red-500" />
          </div>
          <h1 className="mb-2 font-serif text-2xl font-bold text-white">
            Verification Failed
          </h1>
          <p className="mb-8 w-full rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-sm text-red-400/80">
            {message}
          </p>
          <Link href="/contact" className="text-sm text-gray-400 underline hover:text-white">
            Contact Support
          </Link>
        </div>
      ) : null}
    </div>
  );
}
