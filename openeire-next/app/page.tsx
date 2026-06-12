import { buildPageMetadata } from "@/lib/seo/metadata";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata = buildPageMetadata({
  title: "OpenÉire Studios",
  path: "/",
});

export default function Home() {
  return (
    <PlaceholderPage
      title="Homepage"
      description="Foundation route for the future server-rendered OpenÉire Studios homepage."
    />
  );
}
