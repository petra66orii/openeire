import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "Footage | OpenÉire Studios",
  path: "/footage",
});

export default function FootagePage() {
  return (
    <PlaceholderPage
      title="Footage"
      description="Foundation route for the future aerial footage landing page."
    />
  );
}
