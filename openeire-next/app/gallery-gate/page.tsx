import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryGateClient } from "@/components/gallery/GalleryGateClient";

export const metadata: Metadata = {
  title: "Private Collection Access | OpenÉire Studios",
  description:
    "Request access, sign in with the same email, and unlock the private OpenÉire Studios digital collection.",
  alternates: {
    canonical: "/gallery-gate",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function GalleryGatePage() {
  return (
    <Suspense
      fallback={
        <div className="page-top-offset flex min-h-screen items-center justify-center bg-brand-900 px-4 pb-16 text-white">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <GalleryGateClient />
    </Suspense>
  );
}
