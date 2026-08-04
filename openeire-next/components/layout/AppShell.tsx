"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/Providers";
import {
  buildGoogleAnalyticsBootstrap,
  GA_SCRIPT_ID,
  GA_SCRIPT_SRC,
} from "@/lib/analyticsConfig";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isPrivateDelivery =
    pathname.startsWith("/delivery/") || pathname.startsWith("/api/delivery/");
  const isPrivateBooking =
    pathname.startsWith("/book/") || pathname.startsWith("/api/book/");

  if (isPrivateDelivery || isPrivateBooking) {
    return (
      <main id="main" tabIndex={-1} className="min-h-screen bg-zinc-950 text-white">
        {children}
      </main>
    );
  }

  return (
    <>
      <Script
        id="openeire-ga4-bootstrap"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: buildGoogleAnalyticsBootstrap() }}
      />
      <Script
        id="openeire-iubenda-widget"
        src="https://embeds.iubenda.com/widgets/b39f0cd0-25d9-49f2-9306-1258615676f2.js"
        strategy="afterInteractive"
      />
      <Script id={GA_SCRIPT_ID} src={GA_SCRIPT_SRC} strategy="afterInteractive" />
      <Providers>
        <div className="flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-open-gold focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:uppercase focus:tracking-[0.18em] focus:text-black"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </Providers>
    </>
  );
}
