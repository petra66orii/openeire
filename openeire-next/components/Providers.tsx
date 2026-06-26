"use client";

import type { ReactNode } from "react";
import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { BackToTop } from "@/components/BackToTop";
import { CartProvider } from "@/components/cart/CartProvider";
import { DiscountDeepLinkCapture } from "@/components/discount/DiscountDeepLinkCapture";
import { NewsletterSignupModal } from "@/components/newsletter/NewsletterSignupModal";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <AnalyticsListener />
          <DiscountDeepLinkCapture />
          <NewsletterSignupModal />
          <BackToTop />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
