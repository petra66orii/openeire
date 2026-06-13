import { JsonLd } from "@/components/JsonLd";
import {
  CardGrid,
  CtaBand,
  HeroSection,
  PageSection,
  TextPanel,
} from "@/components/marketing/MarketingPage";
import { PUBLIC_IMAGES } from "@/lib/assets";
import { SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Fine Art Prints Ireland | Premium Aerial Photography Artwork",
  description:
    "Discover premium aerial photography art prints from OpenÉire Studios for collectors, interiors, and thoughtful gifts.",
  path: "/art-prints",
});

const valueCards = [
  {
    title: "Artwork with a considered finish",
    text: "Every print is selected to hold detail, atmosphere, and presence in real interiors, not just on a thumbnail.",
  },
  {
    title: "Bespoke production, not mass-market stock",
    text: "Prints are produced to order through specialist fulfilment so each piece arrives with gallery-level intent.",
  },
  {
    title: "Clear shipping, clear expectations",
    text: "Shipping is calculated at checkout for each bespoke print order, with eligible promotions applied where available.",
  },
];

const spaces = [
  {
    title: "Made for living spaces",
    text: "Designed to sit comfortably in homes, apartments, and personal spaces where atmosphere matters as much as the image itself.",
  },
  {
    title: "Strong enough for interiors",
    text: "Pieces that work in offices, hospitality settings, and curated interiors where generic wall art would feel too anonymous.",
  },
  {
    title: "Distinctive as a gift",
    text: "A stronger choice than off-the-shelf decor when you want to give something memorable, visual, and lasting.",
  },
];

const printBuyingNotes = [
  "Archival-minded art prints with a premium finish.",
  "Produced as physical pieces for personal display and interiors.",
  "Shipping is handled separately at checkout.",
  "Need help choosing? Use the contact page for a direct enquiry.",
];

export default function ArtPrintsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Fine art prints",
          url: buildAbsoluteUrl("/art-prints"),
          description:
            "Premium aerial photography artwork and fine art prints for collectors, interiors, and gifts.",
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <HeroSection
        eyebrow="Art prints for collectors and interiors"
        title="Fine art prints that feel premium"
        description="OpenÉire Studios turns aerial photography into statement wall art for homes, interiors, and gifting. Each piece is selected to feel editorial, distinctive, and made to live well in real spaces."
        image={PUBLIC_IMAGES.heroPoster}
        actions={[
          { href: "/gallery/physical", label: "Browse Art Prints" },
          { href: "/contact", label: "Request a Print Enquiry", variant: "secondary" },
        ]}
      />
      <PageSection
        eyebrow="Print buying"
        title="Aerial photography artwork with atmosphere and intent"
        description="The print collection is built for buyers looking for something more refined than a generic poster: aerial photography with atmosphere, premium production, and a visual language that suits modern interiors."
      >
        <CardGrid items={valueCards} />
      </PageSection>
      <PageSection
        title="Fine art prints for collectors, interiors, and thoughtful gifts"
        description="If you are looking for a particular landscape, scale, or finish, start with the gallery and then reach out through the contact page for a more direct conversation about the right piece."
      >
        <TextPanel>
          <ul className="grid gap-3">
            {printBuyingNotes.map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        </TextPanel>
      </PageSection>
      <PageSection title="Where the prints belong">
        <CardGrid items={spaces} />
      </PageSection>
      <CtaBand
        title="Ready to find the right piece?"
        description="Browse the print gallery to explore available pieces, then reach out if you want help choosing the right image, scale, or finish for your space."
        actions={[
          { href: "/gallery/physical", label: "Browse Art Prints" },
          { href: "/contact", label: "Contact the Studio", variant: "secondary" },
        ]}
      />
    </>
  );
}
