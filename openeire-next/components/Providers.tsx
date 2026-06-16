"use client";

import type { ReactNode } from "react";
import { BackToTop } from "@/components/BackToTop";
import { NewsletterSignupModal } from "@/components/newsletter/NewsletterSignupModal";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <NewsletterSignupModal />
      <BackToTop />
    </ToastProvider>
  );
}
