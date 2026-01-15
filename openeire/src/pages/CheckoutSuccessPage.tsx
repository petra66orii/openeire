import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart as soon as the success page mounts
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
        {/* 1. Success Icon Animation */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 2. Main Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Payment Successful!
        </h2>

        <p className="mt-2 text-lg text-gray-500">
          Thank you for your order. A confirmation email has been sent to your
          inbox.
        </p>

        {/* 3. "What's Next" - Digital Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8 text-left shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-blue-900">
                Bought a Digital Item?
              </h3>
              <div className="mt-2 text-sm text-blue-800 space-y-2">
                <p>Your files are ready for instant download.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>
                    Go to your <strong>Profile</strong>.
                  </li>
                  <li>
                    Select <strong>Order History</strong>.
                  </li>
                  <li>
                    Click the{" "}
                    <strong className="text-green-700">Download Button</strong>{" "}
                    next to your item.
                  </li>
                </ol>
              </div>
              <div className="mt-4">
                <Link
                  to="/profile"
                  className="text-sm font-bold text-blue-700 hover:text-blue-900 underline flex items-center"
                >
                  Go to Order History now &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="mt-8 flex flex-col space-y-3">
          <Link
            to="/gallery/digital"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-700 hover:bg-green-800 transition-all duration-200"
          >
            Browse More Stock Footage
          </Link>
          <Link
            to="/gallery/digital"
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-700 hover:bg-green-800 transition-all duration-200"
          >
            Browse More Art Prints
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
