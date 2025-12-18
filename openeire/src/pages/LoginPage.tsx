import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { resendVerificationEmail } from "../services/api";
import { toast } from "react-toastify";
import SocialLogin from "../components/SocialLogin";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password, remember);
      navigate("/profile"); // Redirect to a profile page after login
    } catch (err: any) {
      setError(
        err.detail || "Failed to log in. Please check your credentials."
      );
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    try {
      const response = await resendVerificationEmail(email);
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err.detail || err.email?.[0] || "Failed to resend email.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Log In to Your Account
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="text-sm text-right">
            <Link
              to="/request-password-reset"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Forgot your password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Log In
            </button>
            <div className="flex items-center justify-between my-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              {/* Your existing Forgot Password link can go here or remain separate */}
            </div>
          </div>
        </form>
        <SocialLogin />
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>Haven't received your verification email?</p>
          <button
            onClick={handleResendVerification}
            className="font-medium text-primary hover:text-primary/80"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
