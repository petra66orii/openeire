import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SEOHead from "../components/SEOHead";
import { useAuth } from "../context/AuthContext";
import { requestGalleryAccess, verifyGalleryAccess } from "../services/api";
import {
  getGalleryAccessRequestToastErrorMessage,
  getGalleryAccessVerifyToastErrorMessage,
} from "../utils/toast";
import {
  clearGalleryAccessIntent,
  getPendingGalleryCode,
  getPendingGalleryRedirect,
  getRequestedGalleryEmail,
  setPendingGalleryCode,
  setPendingGalleryRedirect,
  setRequestedGalleryEmail,
} from "../utils/galleryAccessFlow";

type GateState = "A" | "B" | "C" | "D" | "E";

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const GalleryGatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, refreshUser, user } = useAuth();

  const [requestEmail, setRequestEmail] = useState("");
  const [requestedEmail, setRequestedEmailState] = useState("");
  const [code, setCode] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const pendingRedirect =
    getPendingGalleryRedirect() ||
    ((location.state as { from?: { pathname?: string } } | undefined)?.from
      ?.pathname ?? "/gallery/digital");
  const accountEmail = normalizeEmail(user?.email ?? "");
  const hasGalleryAccess = Boolean(user?.can_access_gallery);
  const emailsMatch =
    Boolean(requestedEmail) && Boolean(accountEmail) && requestedEmail === accountEmail;

  useEffect(() => {
    localStorage.removeItem("gallery_access");
    setCode(getPendingGalleryCode());
    const storedRequestedEmail = getRequestedGalleryEmail();
    setRequestedEmailState(storedRequestedEmail);
    if (storedRequestedEmail) {
      setRequestEmail(storedRequestedEmail);
      return;
    }
    if (accountEmail) {
      setRequestEmail(accountEmail);
    }
  }, [accountEmail]);

  const gateState: GateState = useMemo(() => {
    if (hasGalleryAccess) return "E";
    if (!isAuthenticated && !requestedEmail) return "A";
    if (!isAuthenticated && requestedEmail) return "B";
    if (isAuthenticated && requestedEmail && !emailsMatch) return "D";
    return "C";
  }, [emailsMatch, hasGalleryAccess, isAuthenticated, requestedEmail]);

  const handleRequestAccess = async (emailOverride?: string) => {
    const emailToUse = normalizeEmail(emailOverride ?? requestEmail);
    if (!emailToUse) {
      toast.error("Enter the email address you want to use for private gallery access.");
      return;
    }

    setIsRequestingCode(true);
    try {
      await requestGalleryAccess(emailToUse);
      setRequestedGalleryEmail(emailToUse);
      setRequestedEmailState(emailToUse);
      setRequestEmail(emailToUse);
      setPendingGalleryRedirect(pendingRedirect);
      toast.success("Access code sent. Check your inbox for the next step.");
      if (gateState === "D") {
        toast.success("We’ve sent a fresh code for the signed-in account.");
      }
    } catch (error: any) {
      toast.error(getGalleryAccessRequestToastErrorMessage(error));
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleStartOver = () => {
    clearGalleryAccessIntent();
    setRequestedEmailState("");
    setCode("");
    setRequestEmail(accountEmail || "");
    toast.success("You can request access with a different email now.");
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error("Enter the access code from your email.");
      return;
    }

    if (!isAuthenticated) {
      setPendingGalleryCode(normalizedCode);
      setPendingGalleryRedirect(pendingRedirect);
      toast("Sign in with the same email you used to request access.");
      navigate("/login", {
        state: {
          from: { pathname: "/gallery-gate" },
          prefillEmail: requestedEmail || undefined,
          fromGalleryGate: true,
        },
      });
      return;
    }

    if (gateState === "D") {
      toast.error("This signed-in email does not match the email where your code was sent.");
      return;
    }

    setIsVerifyingCode(true);
    try {
      const data = await verifyGalleryAccess(normalizedCode);
      if (data.valid) {
        await refreshUser();
        clearGalleryAccessIntent();
        toast.success("Private gallery unlocked.");
        navigate(pendingRedirect, { replace: true });
      }
    } catch (error: any) {
      toast.error(getGalleryAccessVerifyToastErrorMessage(error));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const signInLinkState = {
    from: { pathname: "/gallery-gate" },
    prefillEmail: requestedEmail || requestEmail || undefined,
    fromGalleryGate: true,
  };

  const registerLinkState = {
    from: { pathname: "/gallery-gate" },
    prefillEmail: requestedEmail || requestEmail || undefined,
    fromGalleryGate: true,
  };

  const renderPrimaryPanel = () => {
    if (gateState === "E") {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Access Ready
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-brand-900">
              Your private gallery is unlocked
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              This account already has access to the private digital collection.
            </p>
          </div>
          <button
            onClick={() => navigate("/gallery/digital")}
            className="w-full rounded-lg bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl"
          >
            Continue to Gallery
          </button>
        </div>
      );
    }

    if (gateState === "D") {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Email Check
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-brand-900">
              Sign in with the same email
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Your code was requested for{" "}
              <span className="font-semibold text-brand-900">{requestedEmail}</span>,
              but you are currently signed in as{" "}
              <span className="font-semibold text-brand-900">{accountEmail}</span>.
            </p>
          </div>

          <button
            onClick={() => handleRequestAccess(accountEmail)}
            disabled={isRequestingCode}
            className="w-full rounded-lg bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRequestingCode
              ? "Sending Fresh Code..."
              : "Request a New Code for This Account"}
          </button>

          <Link
            to="/logout"
            className="block w-full rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Switch Account
          </Link>
        </div>
      );
    }

    if (gateState === "B") {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Continue Your Access Request
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-brand-900">
              Use the same email to keep going
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              You’re continuing a gallery access request for{" "}
              <span className="font-semibold text-brand-900">{requestedEmail}</span>.
              Sign in or create your account with this same email, then return
              here to unlock the gallery. If you need another code, you can send
              a fresh one below.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/login"
              state={signInLinkState}
              className="rounded-lg bg-brand-900 px-6 py-4 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-800"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              state={registerLinkState}
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

    if (gateState === "C") {
      return (
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Final Step
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-brand-900">
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

          {!requestedEmail && (
            <p className="text-center text-sm text-gray-500">
              We’ll send the code to <span className="font-semibold text-brand-900">{accountEmail}</span>.
            </p>
          )}

          {requestedEmail && (
            <button
              onClick={handleStartOver}
              type="button"
              className="w-full text-sm font-semibold text-gray-500 underline-offset-4 transition-colors hover:text-brand-900 hover:underline"
            >
              Use a different email
            </button>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <input
              type="text"
              placeholder="A1B2-C3D4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
          <h2 className="mt-2 text-2xl font-serif font-bold text-brand-900">
            Request your access code
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Use the email you plan to use for your account. You’ll sign in or
            create that account next, then enter your emailed code to unlock the gallery.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleRequestAccess();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="creators@studio.com"
            value={requestEmail}
            onChange={(e) => setRequestEmail(e.target.value)}
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
            to="/login"
            state={signInLinkState}
            className="rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            state={registerLinkState}
            className="rounded-lg border border-brand-200 px-6 py-4 text-center text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div
      className="mobile-page-offset relative flex min-h-screen items-center justify-center overflow-x-hidden bg-brand-900 px-4 py-10 sm:py-12"
      style={{ boxSizing: "border-box" }}
    >
      <SEOHead
        title="Private Collection Access"
        description="Request access, sign in with the same email, and unlock the private OpenEire Studios digital collection."
        canonicalPath="/gallery-gate"
        noindex
      />
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
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
        <div className="max-w-full space-y-8 text-center md:text-left">
          <div className="inline-block">
            <span className="rounded-full border border-accent/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Members Only
            </span>
          </div>

          <h1 className="text-4xl font-serif font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
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

          <div className="mx-auto h-1 w-24 rounded bg-accent opacity-80 md:mx-0"></div>

          <div className="pt-4">
            <Link
              to="/"
              className="text-sm text-brand-100 underline decoration-white/30 transition-all hover:text-white hover:decoration-white"
            >
              &larr; Return to Home
            </Link>
          </div>
        </div>

        <div className="w-full max-w-full rounded-2xl border border-white/10 bg-white p-6 shadow-2xl transition-all hover:scale-[1.01] sm:p-8 lg:p-10">
          {requestedEmail && gateState !== "E" && (
            <div className="mb-6 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              Using{" "}
              <span className="font-semibold">{requestedEmail}</span>{" "}
              for gallery access
            </div>
          )}
          {renderPrimaryPanel()}
        </div>
      </div>
    </div>
  );
};

export default GalleryGatePage;
