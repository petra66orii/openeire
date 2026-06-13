import { JsonLd } from "@/components/JsonLd";
import {
  CardGrid,
  CtaBand,
  HeroSection,
  NumberedSteps,
  PageSection,
  TextPanel,
} from "@/components/marketing/MarketingPage";
import { PUBLIC_IMAGES } from "@/lib/assets";
import { SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Commercial Aerial Footage Licensing | OpenÉire Studios",
  description:
    "License premium aerial footage and photography from OpenÉire Studios for commercial, editorial, brand, tourism, property, and production use.",
  path: "/licensing",
});

const audiences = [
  {
    title: "Brands & agencies",
    text: "Campaign-ready aerial visuals for launches, web campaigns, paid media, and brand storytelling with a clear rights scope.",
  },
  {
    title: "Tourism & hospitality",
    text: "Hero imagery for destinations, hotels, resorts, and visitor campaigns that need cinematic Irish scenery.",
  },
  {
    title: "Property & development",
    text: "Aerial footage and stills for site showcases, listings, and planning presentations with polished presentation value.",
  },
  {
    title: "Film & production",
    text: "Commercial and editorial footage for documentaries, promos, and production support work.",
  },
];

const licenceTypes = [
  {
    title: "Commercial / marketing",
    text: "For campaigns, paid placements, brand launches, property marketing, and promotional use where the asset helps sell a product or service.",
  },
  {
    title: "Editorial",
    text: "For documentaries, journalism, publications, and feature work where the aim is to inform or report rather than advertise.",
  },
  {
    title: "Rights-managed scope",
    text: "Usage is reviewed against media, territory, duration, campaign reach, and any exclusivity requirements before approval.",
  },
];

const steps = [
  "Browse the footage library and find the asset that fits your brief.",
  "Open the photo or video page for that asset.",
  "Request a commercial licence with your usage details.",
  "OpenÉire Studios reviews scope, territory, duration, and pricing.",
  "Once approved, you complete payment and receive the written licence terms.",
];

const protections = [
  "Copyright stays with OpenÉire Studios unless a separate written transfer is agreed.",
  "Resale, redistribution, sublicensing, and standalone file sharing are not allowed.",
  "AI training, model fine-tuning, dataset use, and synthetic generation use are prohibited.",
  "Written approval is required whenever the use falls outside the agreed scope.",
];

export default function LicensingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Commercial aerial footage licensing",
          provider: { "@type": "Organization", name: SITE_NAME },
          areaServed: "Worldwide",
          serviceType: "Rights-managed aerial footage and photography licensing",
          url: buildAbsoluteUrl("/licensing"),
          description:
            "Rights-managed licensing for premium aerial footage and photography for commercial and editorial use.",
        }}
      />
      <HeroSection
        eyebrow="Commercial licensing for aerial visuals"
        title="Premium aerial visuals licensed for brands, agencies, and productions"
        description="OpenÉire Studios licenses premium aerial footage and photography on a rights-managed basis. Start by choosing the photo or video asset you want to use, then share the usage details so scope, pricing, and approval can be confirmed."
        image={PUBLIC_IMAGES.irelandGallery}
        actions={[
          { href: "/footage", label: "Browse Footage" },
          { href: "/contact", label: "Speak to the Studio", variant: "secondary" },
        ]}
      />
      <PageSection
        eyebrow="Who it is for"
        title="Commercial and editorial licensing for serious visual use"
        description="Licensing is designed for projects where usage needs to stay clear, approved, and commercially safe from the start."
      >
        <CardGrid items={audiences} columns={2} />
      </PageSection>
      <PageSection title="Licence routes">
        <CardGrid items={licenceTypes} />
      </PageSection>
      <PageSection
        eyebrow="Process"
        title="How licensing works"
        description="The licensing path remains asset-led: find the shot, confirm the use, then complete the approved licence."
      >
        <NumberedSteps steps={steps} />
      </PageSection>
      <PageSection title="What stays protected">
        <TextPanel>
          <ul className="grid gap-3">
            {protections.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </TextPanel>
      </PageSection>
      <CtaBand
        title="Ready to choose the right asset?"
        description="Start with the footage library, then open the asset page to share your usage details and get the right scope confirmed."
        actions={[
          { href: "/footage", label: "Browse Footage" },
          { href: "/contact", label: "Contact the Studio", variant: "secondary" },
          { href: "/licensing/terms", label: "Review Legal Terms", variant: "secondary" },
        ]}
      />
    </>
  );
}
