import { PrivateGalleryAccessShell } from "@/components/gallery/PrivateGalleryAccessShell";

export const metadata = {
  title: "Private Photo Gallery | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function PhotoGalleryPage() {
  return (
    <PrivateGalleryAccessShell
      title="Private photo gallery"
      pendingTitle="Private photo gallery pending migration"
    />
  );
}
