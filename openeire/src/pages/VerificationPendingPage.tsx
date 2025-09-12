import React from "react";

const VerificationPendingPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Please Verify Your Email
        </h1>
        <p className="text-gray-600">
          Thank you for registering! We've sent a verification link to your
          email address. Please click the link to activate your account.
        </p>
        <p className="text-sm text-gray-500">
          (Didn't get an email? Check your spam folder or request a new one.)
        </p>
      </div>
    </div>
  );
};

export default VerificationPendingPage;
