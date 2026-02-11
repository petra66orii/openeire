import React from "react";
import { FaEnvelopeOpenText } from "react-icons/fa";

const VerificationPendingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up">
        {/* Animated Icon */}
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20"></div>
          <FaEnvelopeOpenText className="text-4xl text-accent relative z-10" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-white mb-4">
          Verify Your Email
        </h1>

        <p className="text-gray-400 mb-6 leading-relaxed">
          Thank you for registering. We have sent a secure verification link to
          your email address. Please click the link to activate your account.
        </p>

        <div className="bg-black/40 border border-white/5 rounded-lg p-4 text-xs text-gray-500">
          <p>
            Didn't receive an email? Check your spam folder or{" "}
            <button className="text-accent hover:underline font-bold">
              contact support
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPendingPage;
