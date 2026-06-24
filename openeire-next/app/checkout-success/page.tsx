import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Payment Status | OpenÉire Studios",
  description: "Review the status of your OpenÉire Studios payment submission.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="page-top-offset min-h-screen bg-black text-white" />
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}
