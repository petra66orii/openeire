export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }

  interface ImportMetaEnv {
    readonly VITE_GA_MEASUREMENT_ID?: string;
    readonly VITE_STRIPE_PUBLIC_KEY?: string;
  }
}

