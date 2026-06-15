import { GalleryAccessRequired } from "@/components/gallery/GalleryAccessRequired";

export const metadata = {
  title: "Private Gallery | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function DigitalGalleryPage() {
  return <GalleryAccessRequired title="Private digital gallery" />;
}
