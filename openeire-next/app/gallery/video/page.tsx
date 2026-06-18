import { PrivateGalleryAccessShell } from "@/components/gallery/PrivateGalleryAccessShell";

export const metadata = {
  title: "Private Video Gallery | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function VideoGalleryPage() {
  return (
    <PrivateGalleryAccessShell
      title="Private video gallery"
      pendingTitle="Private video gallery pending migration"
    />
  );
}
