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
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_ASCII,
  buildAbsoluteUrl,
} from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo/jsonLd";

export const metadata = buildPageMetadata({
  title: "Fine Art Prints & Commercial Licensing in Ireland | OpenÉire Studios",
  description:
    "Discover premium fine art prints from Ireland, commercial drone footage licensing, and curated aerial visuals from OpenÉire Studios.",
  path: "/",
});

const services = [
  {
    title: "Fine Art Prints",
    text: "Museum-quality aerial and landscape prints from Ireland, made for collectors, interiors, and thoughtful gifts.",
  },
  {
    title: "Commercial Licensing",
    text: "Rights-managed aerial footage and imagery for brands, agencies, filmmakers, and editorial projects that need a clear usage scope.",
  },
  {
    title: "4K Stock Footage",
    text: "Cinematic aerial stock footage from Ireland and beyond, ready for documentary, brand, editorial, and commercial licensing work.",
  },
];

const trustPoints = [
  {
    title: "Premium visual source material",
    text: "Every page starts from the same idea: careful aerial work that feels distinctive enough for interiors, campaigns, and production use.",
  },
  {
    title: "Ireland-led, globally useful",
    text: "The collection is rooted in Ireland while staying useful for buyers, agencies, and filmmakers who need polished visual assets.",
  },
  {
    title: "Clear next steps",
    text: "Browse prints, explore footage, or move into licensing with straightforward routes that keep usage and fulfilment expectations clear.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd({
            name: SITE_NAME,
            alternateName: SITE_NAME_ASCII,
            url: buildAbsoluteUrl("/"),
            logo: buildAbsoluteUrl(ORGANIZATION_LOGO_PATH),
            description: SITE_DESCRIPTION,
            contactEmail: SITE_CONTACT_EMAIL,
          }),
          buildWebsiteJsonLd({
            name: SITE_NAME,
            alternateName: SITE_NAME_ASCII,
            url: buildAbsoluteUrl("/"),
          }),
        ]}
      />
      <HeroSection
        eyebrow="Est. 2026 · Ireland"
        title="Capturing the World From Above"
        description="Premium fine art prints, commercial licensing, and cinematic aerial footage. Curated from the rugged coasts of Ireland and beyond for collectors, interiors, brands, agencies, and filmmakers."
        image={PUBLIC_IMAGES.heroPoster}
        actions={[
          { href: "/art-prints", label: "Shop Fine Art Prints" },
          { href: "/footage", label: "Browse Footage", variant: "secondary" },
          { href: "/licensing", label: "Explore Licensing", variant: "secondary" },
        ]}
      />
      <PageSection
        eyebrow="What we do"
        title="Fine art prints, commercial licensing, and aerial footage"
        description="Whether you need a statement print for a space, rights-managed visuals for a campaign, or drone footage in Ireland, OpenÉire Studios delivers a focused route into premium aerial visuals."
      >
        <CardGrid items={services} />
      </PageSection>
      <PageSection
        eyebrow="Studio standards"
        title="Built for collectors, brands, agencies, and filmmakers"
      >
        <CardGrid items={trustPoints} />
      </PageSection>
      <PageSection title="Certified and insured aerial operation">
        <TextPanel>
          <p>
            OpenÉire Studios operates with strict adherence to EU aviation safety
            standards. Safety, planning, and clear usage boundaries sit behind
            every print, licence, and aerial production conversation.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-serif text-3xl font-bold text-white">IAA</p>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                Irish Aviation Authority
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-white">EASA</p>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                EU Aviation Safety
              </p>
            </div>
          </div>
        </TextPanel>
      </PageSection>
      <CtaBand
        title="Start with the route that fits your project"
        description="Choose art prints for physical wall pieces, footage for browsing available visual assets, or licensing when you already know the usage you need."
        actions={[
          { href: "/art-prints", label: "Browse Prints" },
          { href: "/licensing", label: "Explore Licensing", variant: "secondary" },
        ]}
      />
    </>
  );
}
