import { PrivateGalleryAccessShell } from "@/components/gallery/PrivateGalleryAccessShell";

export const metadata = {
  title: "Private Video | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function VideoDetailGatePage() {
  return (
    <PrivateGalleryAccessShell
      title="Private video"
      pendingTitle="Private video details pending migration"
    />
  );
}
