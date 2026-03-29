import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaCheckCircle, FaDownload, FaHome, FaBoxOpen } from "react-icons/fa";
import {
  clearCheckoutSuccessContext,
  CheckoutSuccessContext,
  readCheckoutSuccessContext,
} from "../utils/checkoutSuccessContext";

type SuccessCard = {
  title: string;
  body: string;
  icon: React.ReactNode;
  accent: string;
};

type SuccessContent = {
  title: string;
  description: string;
  cards: SuccessCard[];
  primaryLink: string;
  primaryLabel: string;
};

const getSuccessContent = (context: CheckoutSuccessContext | null): SuccessContent => {
  if (context?.hasDigitalItems && context?.hasPhysicalItems) {
    return {
      title: "Order Confirmed",
      description:
        "Your receipt is on the way. Your digital items are ready through email and your account, and your physical prints are now being prepared.",
      cards: [
        {
          title: "Digital Downloads",
          body: "Check your email for personal download links, or open your account order history to download the files again whenever you need them.",
          icon: <FaDownload className="w-4 h-4" />,
          accent: "bg-accent/10 text-accent",
        },
        {
          title: "Physical Prints",
          body: "Your print order is being processed now. We'll email tracking details once the shipment is on the way.",
          icon: <FaBoxOpen className="w-4 h-4" />,
          accent: "bg-blue-500/10 text-blue-400",
        },
      ],
      primaryLink: "/profile",
      primaryLabel: "View Order History",
    };
  }

  if (context?.hasDigitalItems) {
    return {
      title: "Download Ready",
      description:
        "Your payment went through and your digital purchase is ready. Check your email for the download link, or open your order history to download it from your account.",
      cards: [
        {
          title: "Personal Download",
          body: "We've sent your personal-use download link by email. Your order history also keeps the download available inside your account.",
          icon: <FaDownload className="w-4 h-4" />,
          accent: "bg-accent/10 text-accent",
        },
      ],
      primaryLink: "/profile",
      primaryLabel: "Open Order History",
    };
  }

  if (context?.hasPhysicalItems) {
    return {
      title: "Payment Successful",
      description:
        "Thank you for your order. A receipt has been sent to your email address, and your physical prints are now being processed.",
      cards: [
        {
          title: "Physical Prints",
          body: "Your fine art prints are being prepared now. You will receive a shipping update and tracking details once they are dispatched.",
          icon: <FaBoxOpen className="w-4 h-4" />,
          accent: "bg-blue-500/10 text-blue-400",
        },
      ],
      primaryLink: "/gallery",
      primaryLabel: "Continue Shopping",
    };
  }

  return {
    title: "Order Received",
    description:
      "Thank you for your purchase. Your receipt has been sent to your email address. If your order included downloads, use the link from your email or visit your account order history for the latest status.",
    cards: [
      {
        title: "Next Steps",
        body: "Use your email receipt as the source of truth for this order. If you created an account or were already signed in, your order history will also reflect your latest purchases.",
        icon: <FaCheckCircle className="w-4 h-4" />,
        accent: "bg-white/10 text-white",
      },
    ],
    primaryLink: "/profile",
    primaryLabel: "Open Order History",
  };
};

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart();
  const [successContext] = useState<CheckoutSuccessContext | null>(() =>
    readCheckoutSuccessContext(),
  );

  useEffect(() => {
    clearCart();
    try {
      clearCheckoutSuccessContext();
    } catch {
      // Ignore storage cleanup errors; they should not block success rendering.
    }
  }, [clearCart]);

  const content = useMemo(
    () => getSuccessContent(successContext),
    [successContext],
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 pt-20 mobile-page-offset">
      <div className="max-w-2xl w-full bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fade-in-up">
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
          <FaCheckCircle className="relative text-7xl text-accent mx-auto" />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          {content.title}
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          {content.description}
        </p>

        <div className="grid grid-cols-1 gap-4 mb-10 text-left">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${card.accent}`}>{card.icon}</div>
                <h3 className="font-bold text-white">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-400">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to={content.primaryLink}
            className="w-full md:w-auto px-8 py-4 bg-brand-500 text-paper font-bold rounded-xl hover:bg-brand-700 transition-all transform active:scale-95 shadow-lg"
          >
            {content.primaryLabel}
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
