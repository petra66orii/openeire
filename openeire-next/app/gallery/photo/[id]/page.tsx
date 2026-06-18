import { PrivateGalleryAccessShell } from "@/components/gallery/PrivateGalleryAccessShell";

export const metadata = {
  title: "Private Photo | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function PhotoDetailGatePage() {
  return (
    <PrivateGalleryAccessShell
      title="Private photo"
      pendingTitle="Private photo details pending migration"
    />
  );
}
