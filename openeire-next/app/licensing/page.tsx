import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "Licensing | OpenÉire Studios",
  path: "/licensing",
});

export default function LicensingPage() {
  return (
    <PlaceholderPage
      title="Licensing"
      description="Foundation route for commercial licensing content and future asset-led licence journeys."
    />
  );
}
