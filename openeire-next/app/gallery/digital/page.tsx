import { Suspense } from "react";
import { DigitalGalleryClient } from "@/components/gallery/DigitalGalleryClient";

export const metadata = {
  title: "Private Gallery | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function DigitalGalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="sr-only">Loading private gallery</span>
        </div>
      }
    >
      <DigitalGalleryClient />
    </Suspense>
  );
}
