import { GalleryAccessRequired } from "@/components/gallery/GalleryAccessRequired";

export const metadata = {
  title: "Private Photo Gallery | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function PhotoGalleryPage() {
  return <GalleryAccessRequired title="Private photo gallery" />;
}
