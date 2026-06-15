import { GalleryAccessRequired } from "@/components/gallery/GalleryAccessRequired";

export const metadata = {
  title: "Private Photo | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function PhotoDetailGatePage() {
  return <GalleryAccessRequired title="Private photo access required" />;
}
