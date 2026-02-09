import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { requestGalleryAccess, verifyGalleryAccess } from "../services/api";

const GalleryGatePage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Handlers (Same logic as before) ---
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestGalleryAccess(email);
      toast.success("Access code sent! Please check your email.");
      setEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send code.");
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
      toast.error("Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-900 relative overflow-hidden">
      {/* Background Decor (Subtle Pattern) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
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

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Left: Branding & Message */}
        <div className="text-center md:text-left space-y-8">
          <div className="inline-block">
            <span className="text-accent text-xs font-bold tracking-[0.2em] uppercase border border-accent/30 px-3 py-1 rounded-full">
              Members Only
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Private <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-accent">
              Collection
            </span>
          </h1>

          <p className="font-sans text-brand-100 text-lg leading-relaxed opacity-80 max-w-md">
            Our digital stock footage vault is reserved for verified creators.
            Enter your access code to view our 4K library.
          </p>

          <div className="h-1 w-24 bg-accent rounded md:mx-0 mx-auto opacity-80"></div>

          <div className="pt-4">
            <Link
              to="/"
              className="text-sm text-brand-100 hover:text-white underline decoration-white/30 hover:decoration-white transition-all"
            >
              &larr; Return to Home
            </Link>
          </div>
        </div>

        {/* Right: The "Vault" Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 transform transition-all hover:scale-[1.01] border border-white/10">
          {/* Form 1: Enter Code */}
          <div className="mb-10 border-b border-gray-100 pb-10">
            <h2 className="text-xl font-bold font-sans mb-6 text-brand-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-sm">
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
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none font-mono text-center tracking-[0.3em] uppercase text-lg text-brand-900 transition-all placeholder-gray-300"
                maxLength={9}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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

          {/* Form 2: Request Code */}
          <div>
            <h2 className="text-xl font-bold font-sans mb-3 text-brand-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-sm">
                02
              </span>
              Request Access
            </h2>
            <p className="text-sm text-gray-500 mb-5 ml-11 font-sans">
              Don't have a code? We'll email you a 30-day guest pass
              immediately.
            </p>
            <form onSubmit={handleRequestAccess} className="flex gap-3 ml-11">
              <input
                type="email"
                placeholder="creators@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-accent outline-none text-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 border border-brand-200 text-brand-700 font-bold rounded-lg hover:bg-brand-50 hover:text-brand-900 transition-colors text-sm"
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
