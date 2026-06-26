"use client";

import { useEffect, useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useAuth, normalizeAuthErrorMessage } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { getSafeReturnPath } from "@/lib/auth/redirects";

interface SocialLoginProps {
  redirectPath?: string;
}

interface GoogleCodeResponse {
  code?: string;
  error?: string;
  error_description?: string;
}

interface GoogleCodeClient {
  requestCode: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: "popup";
            callback: (response: GoogleCodeResponse) => void;
          }) => GoogleCodeClient;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_SCRIPT_ID = "google-identity-services";

const loadGoogleIdentityScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.oauth2) return Promise.resolve();

  const existingScript = document.getElementById(
    GOOGLE_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google sign-in script failed to load.")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google sign-in script failed to load."));
    document.head.appendChild(script);
  });
};

export function SocialLogin({ redirectPath }: SocialLoginProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const postLoginPath = useMemo(
    () => getSafeReturnPath(redirectPath),
    [redirectPath],
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setScriptError("Google sign-in is not configured.");
      return;
    }

    let isMounted = true;
    loadGoogleIdentityScript()
      .then(() => {
        if (isMounted) {
          setIsReady(Boolean(window.google?.accounts?.oauth2));
        }
      })
      .catch(() => {
        if (isMounted) {
          setScriptError(
            "Google sign-in could not be prepared. Please use email and password.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGoogleLogin = () => {
    if (isSubmitting) return;

    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.oauth2) {
      showToast(
        "Google sign-in is not ready yet. Please try again in a moment.",
        "error",
      );
      return;
    }

    setScriptError(null);
    setIsSubmitting(true);
    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid profile email",
      ux_mode: "popup",
      callback: async (response) => {
        if (!response.code) {
          showToast(
            response.error
              ? "Google sign-in was cancelled or could not be completed."
              : "Google sign-in did not return an authorisation code.",
            "error",
          );
          setIsSubmitting(false);
          return;
        }

        try {
          await loginWithGoogle({ code: response.code });
          showToast("Welcome back.", "success");
          router.replace(postLoginPath);
        } catch (error) {
          showToast(
            normalizeAuthErrorMessage(
              error,
              "Google sign-in could not be completed right now. Please try again or use email and password.",
            ),
            "error",
          );
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    try {
      client.requestCode();
    } catch {
      setIsSubmitting(false);
      showToast(
        "Google sign-in could not be opened. Please try again or use email and password.",
        "error",
      );
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-gray-900 px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={!isReady || isSubmitting}
        className="mt-6 flex w-full items-center justify-center rounded-lg border border-white/20 bg-black px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-white/5 disabled:cursor-wait disabled:opacity-60"
        title={isReady ? "Sign in with Google" : "Preparing Google sign-in"}
      >
        <FcGoogle className="mr-3 text-xl" aria-hidden="true" />
        {isSubmitting
          ? "Signing in with Google..."
          : isReady
            ? "Sign in with Google"
            : "Preparing Google sign-in..."}
      </button>

      {scriptError ? (
        <p className="mt-3 text-center text-xs text-gray-500">{scriptError}</p>
      ) : null}
    </div>
  );
}
