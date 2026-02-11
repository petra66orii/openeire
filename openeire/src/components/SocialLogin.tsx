import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc"; // Using React Icons for cleaner look

const SocialLogin: React.FC = () => {
  const { setAuthData } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await api.post("auth/google/", {
          code: codeResponse.code,
        });
        const data = response.data;
        setAuthData({ access: data.access, refresh: data.refresh });
        toast.success(`Welcome back!`);
        window.location.href = "/";
      } catch (err) {
        console.error("Google Login Error:", err);
        toast.error("Failed to log in with Google.");
      }
    },
    onError: () => toast.error("Google Login Failed"),
    flow: "auth-code",
  });

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="px-2 bg-gray-900 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => googleLogin()}
          type="button"
          className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg shadow-sm bg-black hover:bg-white/5 text-sm font-bold text-white transition-all"
        >
          <FcGoogle className="mr-3 text-xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
