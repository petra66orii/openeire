import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FaCheckCircle,
  FaDownload,
  FaHome,
  FaArrowRight,
} from "react-icons/fa";

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 pt-20">
      <div className="max-w-2xl w-full bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fade-in-up">
        {/* 1. Success Animation */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
          <FaCheckCircle className="relative text-7xl text-accent mx-auto" />
        </div>

        {/* 2. Main Heading */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Thank you for your order. A receipt has been sent to your email
          address.
        </p>

        {/* 3. Next Steps (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
          {/* Digital Downloads Card */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <FaDownload />
              </div>
              <h3 className="font-bold text-white">Digital Assets?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your high-resolution files are ready for instant download in your
              profile.
            </p>
            <Link
              to="/profile"
              className="text-accent text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all"
            >
              Go to Downloads <FaArrowRight />
            </Link>
          </div>

          {/* Physical Prints Card */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white">Physical Prints?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your fine art prints are being processed. You will receive a
              shipping tracking number shortly.
            </p>
          </div>
        </div>

        {/* 4. Primary Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/gallery"
            className="w-full md:w-auto px-8 py-4 bg-brand-500 text-paper font-bold rounded-xl hover:bg-brand-700 transition-all transform active:scale-95 shadow-lg"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="w-full md:w-auto px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <FaHome className="mb-1" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
