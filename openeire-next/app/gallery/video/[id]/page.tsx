import { GalleryAccessRequired } from "@/components/gallery/GalleryAccessRequired";

export const metadata = {
  title: "Private Video | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function VideoDetailGatePage() {
  return <GalleryAccessRequired title="Private video access required" />;
}
