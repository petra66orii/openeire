import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
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
        // Store the session data
        const sessionData = {
          code: code.toUpperCase(), // Store consistent casing
          expiresAt: data.expires_at,
        };
        localStorage.setItem("gallery_access", JSON.stringify(sessionData));

        toast.success("Access Granted. Welcome.");

        const from = (location.state as any)?.from?.pathname || "/gallery";
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error("Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-dark">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Branding */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-5xl font-bold font-sans text-primary">
            Private Gallery
          </h1>
          <p className="font-serif text-gray-300 text-lg leading-relaxed">
            Our digital stock footage collection is available for private
            viewing only.
            <br className="hidden md:block" />
            Please enter your access code to enter the vault.
          </p>
          <div className="h-1 w-24 bg-accent rounded md:mx-0 mx-auto"></div>
        </div>

        {/* Right: Forms */}
        <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
          {/* Form 1: Enter Code */}
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h2 className="text-xl font-bold font-sans mb-4 text-dark flex items-center gap-2">
              <span className="text-primary">01.</span> Enter Access Code
            </h2>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <input
                type="text"
                placeholder="A1B2C3D4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-center tracking-widest uppercase"
                maxLength={8}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? "Verifying..." : "Unlock Gallery"}
              </button>
            </form>
          </div>

          {/* Form 2: Request Code */}
          <div>
            <h2 className="text-xl font-bold font-sans mb-2 text-dark flex items-center gap-2">
              <span className="text-gray-400">02.</span> Request Access
            </h2>
            <p className="text-sm text-gray-500 mb-4 font-serif">
              Don't have a code? We'll email you a 30-day guest pass.
            </p>
            <form onSubmit={handleRequestAccess} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
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
