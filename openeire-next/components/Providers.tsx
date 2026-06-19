"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { BackToTop } from "@/components/BackToTop";
import { CartProvider } from "@/components/cart/CartProvider";
import { NewsletterSignupModal } from "@/components/newsletter/NewsletterSignupModal";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <NewsletterSignupModal />
          <BackToTop />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
