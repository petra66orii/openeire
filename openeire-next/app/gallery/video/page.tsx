import { GalleryAccessRequired } from "@/components/gallery/GalleryAccessRequired";

export const metadata = {
  title: "Private Video Gallery | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function VideoGalleryPage() {
  return <GalleryAccessRequired title="Private video gallery" />;
}
