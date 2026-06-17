"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";

export function LogoutConfirm() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    showToast("You have been logged out.", "success");
    router.replace("/login");
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-2xl">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <FaSignOutAlt className="text-2xl text-accent" aria-hidden="true" />
      </div>
      <h1 className="mb-3 font-serif text-3xl font-bold text-white">
        Log Out?
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-gray-400">
        You&apos;ll need to sign in again to access orders, downloads, and any
        private gallery areas.
      </p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-lg bg-brand-500 px-4 py-3 font-bold text-paper shadow-lg transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-gray-300 transition-colors hover:border-white/30 hover:text-white"
        >
          <FaArrowLeft className="text-xs" aria-hidden="true" />
          Stay Signed In
        </button>
      </div>
    </div>
  );
}
