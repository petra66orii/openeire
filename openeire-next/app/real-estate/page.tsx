import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "Real Estate | OpenÉire Studios",
  path: "/real-estate",
});

export default function RealEstatePage() {
  return (
    <PlaceholderPage
      title="Real Estate"
      description="Foundation route for the future real estate photography and video landing page."
    />
  );
}
