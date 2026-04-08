import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getGalleryAccessRequestToastErrorMessage,
  getGalleryAccessVerifyToastErrorMessage,
} from "../utils/toast";
import { requestGalleryAccess, verifyGalleryAccess } from "../services/api";

const GalleryGatePage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestGalleryAccess(email);
      toast.success("Access code sent! Please check your email.");
      setEmail("");
    } catch (error: any) {
      toast.error(getGalleryAccessRequestToastErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await verifyGalleryAccess(code);
      if (data.valid) {
        const sessionData = {
          code: code.toUpperCase(),
          expiresAt: data.expires_at,
        };
        localStorage.setItem("gallery_access", JSON.stringify(sessionData));
        toast.success("Access Granted. Welcome.");
        const from =
          (location.state as any)?.from?.pathname || "/gallery/digital";
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(getGalleryAccessVerifyToastErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-brand-900 px-4 py-10 mobile-page-offset sm:py-12"
      style={{ boxSizing: "border-box" }}
    >
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

          <p className="mx-auto max-w-md text-base leading-relaxed text-brand-100 opacity-80 sm:text-lg md:mx-0">
            Our digital stock footage vault is reserved for verified creators.
            Enter your access code to view our 4K library.
          </p>

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
          <div className="mb-10 border-b border-gray-100 pb-10">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold font-sans text-brand-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm text-brand-700">
                01
              </span>
              Enter Access Code
            </h2>
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
                disabled={isLoading}
                className="w-full rounded-lg bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Unlock Vault"
                )}
              </button>
            </form>
          </div>

          <div>
            <h2 className="mb-3 flex items-center gap-3 text-xl font-bold font-sans text-brand-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500">
                02
              </span>
              Request Access
            </h2>
            <p className="mb-5 text-sm text-gray-500 font-sans leading-relaxed sm:ml-11">
              Don&apos;t have a code? We&apos;ll email you a 30-day guest pass
              immediately.
            </p>
            <p className="mb-5 text-xs text-gray-400 font-sans leading-relaxed sm:ml-11">
              By requesting access, you agree to receive this gallery-pass email
              and any follow-up access-related messages for the private
              collection.
            </p>
            <form
              onSubmit={handleRequestAccess}
              className="flex flex-col gap-3 sm:ml-11 sm:flex-row"
            >
              <input
                type="email"
                placeholder="creators@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full flex-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg border border-brand-200 px-6 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900 sm:w-auto"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryGatePage;

