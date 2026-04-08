import React, { useEffect, useMemo, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { getGoogleLoginToastErrorMessage } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";

interface SocialLoginProps {
  redirectPath?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: unknown;
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";

const normalizeInternalPath = (value?: string): string | null => {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

const SocialLoginButton: React.FC<SocialLoginProps> = ({ redirectPath }) => {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  const stateRedirectPath = (
    location.state as
      | { from?: { pathname?: string } }
      | undefined
  )?.from?.pathname;
  const postLoginPath =
    normalizeInternalPath(redirectPath) ??
    normalizeInternalPath(stateRedirectPath) ??
    "/";

  useEffect(() => {
    const checkGoogleReady = () => {
      setIsGoogleReady(Boolean(window.google?.accounts?.oauth2));
    };

    checkGoogleReady();

    if (window.google?.accounts?.oauth2) return;

    const intervalId = window.setInterval(() => {
      if (!window.google?.accounts?.oauth2) return;
      checkGoogleReady();
      window.clearInterval(intervalId);
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await api.post("auth/google/", {
          code: codeResponse.code,
        });
        const data = response.data;
        setAuthData({ access: data.access, refresh: data.refresh });
        toast.success("Welcome back!");
        navigate(postLoginPath, { replace: true });
      } catch (err) {
        console.error("Google Login Error:", err);
        toast.error(getGoogleLoginToastErrorMessage(err));
      }
    },
    onError: () =>
      toast.error("Google sign-in was cancelled or could not be started."),
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
          disabled={!isGoogleReady}
          className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg shadow-sm bg-black hover:bg-white/5 text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-wait"
          title={isGoogleReady ? "Sign in with Google" : "Preparing Google sign-in"}
        >
          <FcGoogle className="mr-3 text-xl" />
          {isGoogleReady ? "Sign in with Google" : "Preparing Google sign-in..."}
        </button>
      </div>
    </div>
  );
};

const SocialLogin: React.FC<SocialLoginProps> = ({ redirectPath }) => {
  const provider = useMemo(() => {
    if (!GOOGLE_CLIENT_ID) return null;

    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <SocialLoginButton redirectPath={redirectPath} />
      </GoogleOAuthProvider>
    );
  }, [redirectPath]);

  if (!GOOGLE_CLIENT_ID) {
    console.error(
      "Google sign-in is disabled because VITE_GOOGLE_CLIENT_ID is not configured.",
    );
    return null;
  }

  return provider;
};

export default SocialLogin;

