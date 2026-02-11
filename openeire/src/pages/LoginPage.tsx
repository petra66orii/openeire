import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { resendVerificationEmail } from "../services/api";
import toast from "react-hot-toast";
import SocialLogin from "../components/SocialLogin";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, remember);
      toast.success("Welcome back.");
      navigate("/profile");
    } catch (err: any) {
      toast.error(
        err.detail || "Failed to log in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    const toastId = toast.loading("Sending email...");
    try {
      const response = await resendVerificationEmail(email);
      toast.success(response.message, { id: toastId });
    } catch (err: any) {
      toast.error(err.detail || "Failed to resend email.", { id: toastId });
    }
  };

  // Styles
  const inputClass =
    "w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 pt-20">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your gallery and orders.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                Password
              </label>
              <Link
                to="/request-password-reset"
                className="text-xs text-brand-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 text-brand-500 bg-black border-white/20 rounded focus:ring-brand-500 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-400 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-500 text-paper font-bold rounded-lg hover:bg-brand-700 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <SocialLogin />

        <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-white/10">
          <p className="mb-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white font-bold hover:text-brand-500 transition-colors"
            >
              Sign up
            </Link>
          </p>
          <button
            onClick={handleResendVerification}
            className="text-xs text-gray-600 hover:text-gray-400 underline"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
