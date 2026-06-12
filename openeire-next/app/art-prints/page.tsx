import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "Art Prints | OpenÉire Studios",
  path: "/art-prints",
});

export default function ArtPrintsPage() {
  return (
    <PlaceholderPage
      title="Art Prints"
      description="Foundation route for the future fine art print landing page."
    />
  );
}
