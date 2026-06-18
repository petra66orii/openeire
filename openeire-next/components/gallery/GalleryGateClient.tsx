"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { requestGalleryAccess, verifyGalleryAccess } from "@/lib/api/galleryAccess";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import { getSafeReturnPath } from "@/lib/auth/redirects";
import {
  clearGalleryAccessIntent,
  getPendingGalleryCode,
  getPendingGalleryRedirect,
  getRequestedGalleryEmail,
  setPendingGalleryCode,
  setPendingGalleryRedirect,
  setRequestedGalleryEmail,
} from "@/lib/gallery/accessIntent";

type GateState =
  | "loggedOutStart"
  | "loggedOutRequested"
  | "readyToVerify"
  | "emailMismatch"
  | "alreadyApproved";

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const getSafeGalleryRedirect = (value: string | null | undefined) => {
  const safePath = getSafeReturnPath(value, "/gallery/digital");
  const [safePathname] = safePath.split(/[?#]/);
  return safePath.startsWith("/gallery") && safePathname !== "/gallery-gate"
    ? safePath
    : "/gallery/digital";
};

export function GalleryGateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [requestEmail, setRequestEmail] = useState("");
  const [requestedEmail, setRequestedEmailState] = useState("");
  const [code, setCode] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accountEmail = normalizeEmail(user?.email ?? "");
  const hasGalleryAccess = Boolean(user?.can_access_gallery);

  const pendingRedirect = useMemo(() => {
    const nextParam = searchParams.get("next");
    const storedRedirect = getPendingGalleryRedirect();
    return getSafeGalleryRedirect(nextParam || storedRedirect);
  }, [searchParams]);

  const emailsMatch =
    Boolean(requestedEmail) &&
    Boolean(accountEmail) &&
    requestedEmail === accountEmail;

  useEffect(() => {
    localStorage.removeItem("gallery_access");
    setCode(getPendingGalleryCode());
    const storedRequestedEmail = getRequestedGalleryEmail();
    setRequestedEmailState(storedRequestedEmail);
    setRequestEmail(storedRequestedEmail || accountEmail);
  }, [accountEmail]);

  useEffect(() => {
    setPendingGalleryRedirect(pendingRedirect);
  }, [pendingRedirect]);

  useEffect(() => {
    if (!hasGalleryAccess) return;
    clearGalleryAccessIntent();
    router.replace(pendingRedirect || "/gallery/digital");
  }, [hasGalleryAccess, pendingRedirect, router]);

  const gateState: GateState = useMemo(() => {
    if (hasGalleryAccess) return "alreadyApproved";
    if (!isAuthenticated && !requestedEmail) return "loggedOutStart";
    if (!isAuthenticated && requestedEmail) return "loggedOutRequested";
    if (isAuthenticated && requestedEmail && !emailsMatch) {
      return "emailMismatch";
    }
    return "readyToVerify";
  }, [emailsMatch, hasGalleryAccess, isAuthenticated, requestedEmail]);

  const handleRequestAccess = async (emailOverride?: string) => {
    const emailToUse = normalizeEmail(emailOverride ?? requestEmail);
    if (!emailToUse) {
      setErrorMessage("Enter the email address you want to use for private gallery access.");
      return;
    }

    setIsRequestingCode(true);
    setErrorMessage(null);
    try {
      await requestGalleryAccess({ email: emailToUse });
      setRequestedGalleryEmail(emailToUse);
      setRequestedEmailState(emailToUse);
      setRequestEmail(emailToUse);
      setPendingGalleryRedirect(pendingRedirect);
      showToast("Access code sent. Check your inbox for the next step.", "success");
    } catch (error) {
      const message = normalizeAuthErrorMessage(
        error,
        "Unable to send access code right now. Please try again later.",
      );
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleStartOver = () => {
    clearGalleryAccessIntent();
    setRequestedEmailState("");
    setCode("");
    setRequestEmail(accountEmail || "");
    setErrorMessage(null);
    showToast("You can request access with a different email now.", "success");
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setErrorMessage("Enter the access code from your email.");
      return;
    }

    if (!isAuthenticated) {
      setPendingGalleryCode(normalizedCode);
      setPendingGalleryRedirect(pendingRedirect);
      showToast("Sign in with the same email you used to request access.", "info");
      router.push(
        `/login?next=${encodeURIComponent("/gallery-gate")}${
          requestedEmail ? `&email=${encodeURIComponent(requestedEmail)}` : ""
        }`,
      );
      return;
    }

    if (gateState === "emailMismatch") {
      setErrorMessage(
        "This signed-in email does not match the email where your code was sent.",
      );
      return;
    }

    setIsVerifyingCode(true);
    setErrorMessage(null);
    try {
      const response = await verifyGalleryAccess({ access_code: normalizedCode });
      if (response.valid) {
        const refreshedUser = await refreshUser();
        clearGalleryAccessIntent();
        showToast("Private gallery unlocked.", "success");
        router.replace(
          refreshedUser?.can_access_gallery ? pendingRedirect : "/profile",
        );
      }
    } catch (error) {
      const message = normalizeAuthErrorMessage(
        error,
        "Invalid or expired code.",
      );
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const loginHref = `/login?next=${encodeURIComponent("/gallery-gate")}${
    requestedEmail || requestEmail
      ? `&email=${encodeURIComponent(requestedEmail || requestEmail)}`
      : ""
  }`;
  const registerHref = `/register?next=${encodeURIComponent("/gallery-gate")}${
    requestedEmail || requestEmail
      ? `&email=${encodeURIComponent(requestedEmail || requestEmail)}`
      : ""
  }`;

  const renderPrimaryPanel = () => {
    if (isLoading) {
      return (
        <div className="space-y-5 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Checking Access
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">
              Looking up your private gallery status
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We&apos;ll send you straight to the gallery if this account is already
              unlocked.
            </p>
          </div>
        </div>
      );
    }

    if (gateState === "alreadyApproved") {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Access Ready
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">
              Your private gallery is unlocked
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Redirecting you to the private digital collection now.
            </p>
          </div>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
        </div>
      );
    }

    if (gateState === "emailMismatch") {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Email Check
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">
              Sign in with the same email
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Your code was requested for{" "}
              <span className="font-semibold text-brand-900">{requestedEmail}</span>
              , but you are currently signed in as{" "}
              <span className="font-semibold text-brand-900">{accountEmail}</span>.
            </p>
          </div>

          <button
            onClick={() => handleRequestAccess(accountEmail)}
            disabled={isRequestingCode}
            className="w-full rounded-lg bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRequestingCode ? "Sending Fresh Code..." : "Request a New Code for This Account"}
          </button>

          <Link
            href="/logout"
            className="block w-full rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Switch Account
          </Link>
        </div>
      );
    }

    if (gateState === "loggedOutRequested") {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Continue Your Access Request
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">
              Use the same email to keep going
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              You&apos;re continuing a gallery access request for{" "}
              <span className="font-semibold text-brand-900">{requestedEmail}</span>.
              Sign in or create your account with this same email, then return
              here to unlock the gallery.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={loginHref}
              className="rounded-lg bg-brand-900 px-6 py-4 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-800"
            >
              Sign In
            </Link>
            <Link
              href={registerHref}
              className="rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
            >
              Create Account
            </Link>
          </div>

          <button
            onClick={() => handleRequestAccess(requestedEmail)}
            disabled={isRequestingCode}
            className="w-full rounded-lg border border-brand-200 px-6 py-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRequestingCode ? "Sending Fresh Code..." : "Send a Fresh Code"}
          </button>

          <button
            onClick={handleStartOver}
            type="button"
            className="w-full text-sm font-semibold text-gray-500 underline-offset-4 transition-colors hover:text-brand-900 hover:underline"
          >
            Use a different email
          </button>
        </div>
      );
    }

    if (gateState === "readyToVerify") {
      return (
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Final Step
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">
              Enter your access code
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {requestedEmail
                ? `Use the code sent to ${requestedEmail} to unlock the private digital gallery.`
                : `Request a code for ${accountEmail} and then enter it here to unlock the private digital gallery.`}
            </p>
          </div>

          <button
            onClick={() => handleRequestAccess(requestedEmail || accountEmail)}
            disabled={isRequestingCode}
            className="w-full rounded-lg border border-brand-200 px-6 py-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRequestingCode
              ? "Sending Fresh Code..."
              : requestedEmail
                ? "Send a Fresh Code"
                : "Request Access Code"}
          </button>

          {requestedEmail ? (
            <button
              onClick={handleStartOver}
              type="button"
              className="w-full text-sm font-semibold text-gray-500 underline-offset-4 transition-colors hover:text-brand-900 hover:underline"
            >
              Use a different email
            </button>
          ) : null}

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <input
              type="text"
              placeholder="A1B2-C3D4"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center font-mono text-base uppercase tracking-[0.2em] text-brand-900 outline-none transition-all placeholder-gray-300 focus:border-transparent focus:ring-2 focus:ring-accent sm:text-lg sm:tracking-[0.3em]"
              maxLength={9}
            />
            <button
              type="submit"
              disabled={isVerifyingCode}
              className="w-full rounded-lg bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isVerifyingCode ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Private Access
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-brand-900">
            Request your access code
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Use the email you plan to use for your account. You&apos;ll sign in
            or create that account next, then enter your emailed code to unlock
            the gallery.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleRequestAccess();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="creators@studio.com"
            value={requestEmail}
            onChange={(event) => setRequestEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-brand-900 outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={isRequestingCode}
            className="w-full rounded-lg bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRequestingCode ? "Sending Code..." : "Request Access Code"}
          </button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={loginHref}
            className="rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Sign In
          </Link>
          <Link
            href={registerHref}
            className="rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="page-top-offset relative flex min-h-screen items-center justify-center overflow-x-hidden bg-brand-900 px-4 pb-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <svg width="100%" height="100%" aria-hidden="true">
          <pattern
            id="gate-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#gate-grid)" />
        </svg>
      </div>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div className="space-y-8 text-center md:text-left">
          <span className="inline-block rounded-full border border-accent/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Members Only
          </span>
          <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Private <br />
            <span className="bg-gradient-to-r from-brand-100 to-accent bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <div className="space-y-3 text-brand-100/85">
            <p className="text-base leading-relaxed sm:text-lg">
              Unlock our private digital gallery in three simple steps.
            </p>
            <ol className="space-y-3 text-sm leading-relaxed sm:text-base">
              <li>1. Request your access code.</li>
              <li>2. Sign in or create an account with the same email.</li>
              <li>3. Enter the code to unlock the gallery.</li>
            </ol>
          </div>
          <div className="mx-auto h-1 w-24 rounded bg-accent opacity-80 md:mx-0" />
          <Link
            href="/"
            className="inline-block text-sm text-brand-100 underline decoration-white/30 transition-all hover:text-white hover:decoration-white"
          >
            &larr; Return to Home
          </Link>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-white p-6 text-brand-900 shadow-2xl transition-all hover:scale-[1.01] sm:p-8 lg:p-10">
          {requestedEmail && gateState !== "alreadyApproved" ? (
            <div className="mb-6 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              Using <span className="font-semibold">{requestedEmail}</span> for
              gallery access
            </div>
          ) : null}
          {errorMessage ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          {renderPrimaryPanel()}
        </div>
      </div>
    </div>
  );
}
