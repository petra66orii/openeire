import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "Blog | OpenÉire Studios",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PlaceholderPage
      title="Blog"
      description="Foundation route for the future server-rendered journal index."
    />
  );
}
