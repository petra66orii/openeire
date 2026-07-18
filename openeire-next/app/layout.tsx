import type { Metadata } from "next";
import { Merriweather, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/Providers";
import {
  buildGoogleAnalyticsBootstrap,
  GA_SCRIPT_ID,
  GA_SCRIPT_SRC,
} from "@/lib/analyticsConfig";
import { buildDefaultMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildDefaultMetadata();

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${merriweather.variable}`}>
      <body>
        <Script
          id="openeire-ga4-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: buildGoogleAnalyticsBootstrap() }}
        />
        <Script
          id="openeire-iubenda-widget"
          src="https://embeds.iubenda.com/widgets/b39f0cd0-25d9-49f2-9306-1258615676f2.js"
          strategy="beforeInteractive"
        />
        <Script
          id={GA_SCRIPT_ID}
          src={GA_SCRIPT_SRC}
          strategy="beforeInteractive"
        />
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
      </body>
    </html>
  );
}
