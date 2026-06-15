import Link from "next/link";
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
import {
  FaBuilding,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaGift,
  FaHome,
  FaPalette,
  FaShippingFast,
} from "react-icons/fa";

export const metadata = buildPageMetadata({
  title: "Fine Art Prints Ireland | Premium Aerial Photography Artwork",
  description:
    "Discover premium fine art prints from OpenÉire Studios. Browse aerial photography artwork for collectors, interiors, and gifts, with bespoke production and shipping calculated at checkout.",
  path: "/art-prints",
});

const shippingNote =
  "Shipping is calculated at checkout, and eligible Ireland print orders over €180.00 qualify for free shipping.";

const valueCards = [
  {
    icon: <FaPalette />,
    title: "Artwork with a considered finish",
    text: "Every print is selected to hold detail, atmosphere, and presence in real interiors, not just on a thumbnail.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Bespoke production, not mass-market stock",
    text: "Prints are produced to order through specialist fulfilment so the final piece arrives with gallery-level intent rather than feeling like disposable wall decor.",
  },
  {
    icon: <FaShippingFast />,
    title: "Clear shipping, clear expectations",
    text: shippingNote,
  },
];

const spaces = [
  {
    icon: <FaHome />,
    title: "Made for living spaces",
    text: "Designed to sit comfortably in homes, apartments, and personal spaces where atmosphere matters as much as the image itself.",
  },
  {
    icon: <FaBuilding />,
    title: "Strong enough for interiors",
    text: "Pieces that work in offices, hospitality settings, and curated interiors where generic wall art would feel too anonymous.",
  },
  {
    icon: <FaGift />,
    title: "Distinctive as a gift",
    text: "A stronger choice than off-the-shelf decor when you want to give something memorable, visual, and lasting.",
  },
];

const printBuyingNotes = [
  "Archival-minded art prints with a premium finish.",
  "Produced as physical pieces for personal display and interiors.",
  "Shipping is handled separately at checkout.",
  "Eligible Ireland orders over €180.00 qualify for free shipping.",
  "Need help choosing? Use the contact page for a direct enquiry.",
];

export default function ArtPrintsPage() {
  return (
    <div className="min-h-screen bg-black pb-20 text-white">
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
        title="Fine art prints that feel premium."
        description="OpenÉire Studios turns aerial photography into statement wall art for homes, interiors, and gifting. These are not generic poster prints. Each piece is selected to feel editorial, distinctive, and made to live well in real spaces."
        image={PUBLIC_IMAGES.heroPoster}
        actions={[
          { href: "/gallery/physical", label: "Browse Art Prints" },
          {
            href: "/contact",
            label: "Request a Print Enquiry",
            variant: "secondary",
          },
        ]}
        note={shippingNote}
      />
      <PageSection>
        <CardGrid items={valueCards} />
      </PageSection>
      <PageSection
        title="Fine art prints for collectors, interiors, and thoughtful gifts."
        description="The print collection is built for buyers looking for something more refined than a generic poster: aerial photography with atmosphere, premium production, and a visual language that suits modern interiors, curated spaces, and gift-worthy purchases. If you are looking for a particular landscape, scale, or finish, start with the gallery and then reach out through the contact page for a more direct conversation about the right piece."
      >
        <TextPanel>
          <h3 className="font-serif text-lg font-bold text-white md:text-xl">
            Print buying notes
          </h3>
          <ul className="mt-4 grid gap-3">
            {printBuyingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-accent transition-colors hover:text-white"
          >
            Talk to the studio <FaExternalLinkAlt className="text-xs" />
          </Link>
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
    </div>
  );
}
