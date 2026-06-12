import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "US Landing Hub | OpenÉire Studios",
  path: "/us",
});

export default function UsPage() {
  return (
    <PlaceholderPage
      title="United States Landing Hub"
      description="Foundation route for future US-targeted search landing pages."
    />
  );
}
