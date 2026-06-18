import { Suspense } from "react";
import { DigitalGalleryDetailClient } from "@/components/gallery/DigitalGalleryDetailClient";

export const metadata = {
  title: "Private Video | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="sr-only">Loading private video</span>
        </div>
      }
    >
      <DigitalGalleryDetailClient id={id} type="video" />
    </Suspense>
  );
}
