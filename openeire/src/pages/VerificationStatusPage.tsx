import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

type Status = "verifying" | "success" | "error";

const VerificationStatusPage: React.FC = () => {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState<string>("Verifying your account...");
  const { token } = useParams<{ token: string }>();

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
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-10 text-center animate-fade-in-up">
        {/* 1. LOADING STATE */}
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-4xl text-accent animate-spin mb-6" />
            <h1 className="text-2xl font-serif font-bold text-white mb-2">
              Verifying...
            </h1>
            <p className="text-gray-400 text-sm">
              Please wait while we secure your account.
            </p>
          </div>
        )}

        {/* 2. SUCCESS STATE */}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Verified
            </h1>
            <p className="text-gray-400 mb-8">{message}</p>

            <Link
              to="/login"
              className="w-full py-3 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              Go to Login <FaArrowRight className="text-sm" />
            </Link>
          </div>
        )}

        {/* 3. ERROR STATE */}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <FaTimesCircle className="text-4xl text-red-500" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-red-400/80 mb-8 text-sm bg-red-500/5 p-3 rounded-lg border border-red-500/10 w-full">
              {message}
            </p>

            <Link
              to="/contact"
              className="text-gray-400 hover:text-white underline text-sm"
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
