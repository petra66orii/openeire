import { JsonLd } from "@/components/JsonLd";
import {
  CardGrid,
  CtaBand,
  HeroSection,
  PageSection,
  TextPanel,
} from "@/components/marketing/MarketingPage";
import { PUBLIC_IMAGES } from "@/lib/assets";
import {
  ORGANIZATION_LOGO_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_ASCII,
  buildAbsoluteUrl,
} from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonLd";

export const metadata = buildPageMetadata({
  title: "OpenÉire Studios for US Collectors | Irish Aerial Wall Art",
  description:
    "Learn about OpenÉire Studios for US buyers seeking Irish aerial photography prints, landscape wall art, and premium visual assets.",
  path: "/us",
});

const routes = [
  {
    title: "Fine art prints USA",
    text: "A focused route for US collectors looking for premium aerial landscape prints from Ireland and beyond.",
  },
  {
    title: "Wall art for living rooms",
    text: "Irish aerial wall art positioned for warm, personal spaces where atmosphere and scale matter.",
  },
  {
    title: "Wall art for offices",
    text: "Premium landscape and aerial prints for professional interiors, reception areas, and workspaces.",
  },
];

const trustCards = [
  {
    title: "Irish aerial perspective",
    text: "OpenÉire Studios is rooted in aerial photography and a careful visual language shaped by Ireland's coastlines, landscapes, and atmosphere.",
  },
  {
    title: "Premium print intent",
    text: "The collection is positioned for buyers who want statement pieces rather than generic wall decor.",
  },
  {
    title: "Clear buying paths",
    text: "US visitors can browse print-focused pages by intent, from fine art prints to large wall art and room-specific collections.",
  },
];

export default function USPage() {
  return (
    <>
      <JsonLd
        data={
          buildOrganizationJsonLd({
            name: SITE_NAME,
            alternateName: SITE_NAME_ASCII,
            url: buildAbsoluteUrl("/"),
            logo: buildAbsoluteUrl(ORGANIZATION_LOGO_PATH),
            description: SITE_DESCRIPTION,
          })
        }
      />
      <HeroSection
        eyebrow="For US collectors and interiors"
        title="Irish aerial wall art for US spaces"
        description="OpenÉire Studios creates premium aerial photography, fine art prints, and curated visual assets from Ireland for collectors, interiors, and design-led buyers in the United States."
        image={PUBLIC_IMAGES.thaiSunset}
        actions={[
          { href: "/us/fine-art-prints", label: "Explore Fine Art Prints" },
          { href: "/art-prints", label: "Browse Print Collection", variant: "secondary" },
        ]}
      />
      <PageSection
        eyebrow="About OpenÉire Studios"
        title="Premium aerial imagery with a print-first eye"
        description="OpenÉire Studios brings aerial photography into physical spaces through artwork selected for mood, clarity, and presence."
      >
        <CardGrid items={trustCards} />
      </PageSection>
      <PageSection title="US print routes">
        <CardGrid items={routes} />
      </PageSection>
      <PageSection title="What US buyers should know">
        <TextPanel>
          <p>
            The main OpenÉire Studios collection remains available through the
            art prints route. US-focused pages help buyers compare wall art by
            room, size, and search intent while keeping the same brand, artwork,
            and quality expectations.
          </p>
        </TextPanel>
      </PageSection>
      <CtaBand
        title="Start with the US print route that fits your space"
        description="Browse fine art prints, wall art, aerial photography prints, and room-specific collection pages created for US search intent."
        actions={[
          { href: "/us/fine-art-prints", label: "Fine Art Prints USA" },
          { href: "/us/wall-art-prints", label: "Wall Art Prints", variant: "secondary" },
          { href: "/us/large-wall-art", label: "Large Wall Art", variant: "secondary" },
        ]}
      />
    </>
  );
}
