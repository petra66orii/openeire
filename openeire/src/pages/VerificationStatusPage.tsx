import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";

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
        setMessage(response.message);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.error || "An unknown error occurred.");
      }
    };

    handleVerification();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 text-center bg-white rounded-lg shadow-md">
        {status === "verifying" && (
          <h1 className="text-2xl font-bold text-gray-900">{message}</h1>
          // You could add a loading spinner here
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              Verification Successful!
            </h1>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/login"
              className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              Verification Failed
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationStatusPage;
