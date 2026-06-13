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
import { REAL_ESTATE_PACKAGES } from "@/lib/realEstate";
import { SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Real Estate Photography & Drone Video in Connacht | OpenÉire Studios",
  description:
    "Professional real estate photography, aerial drone video, and 3D virtual tours for estate agents, developers, and private sellers across Connacht.",
  path: "/real-estate",
});

const services = [
  {
    title: "Interior and exterior photography",
    text: "Professionally edited property photography for portals, brochures, websites, and social media campaigns.",
  },
  {
    title: "Aerial video",
    text: "Drone video for standout listings, rural properties, waterfront homes, new builds, and social-first property campaigns.",
  },
  {
    title: "3D virtual tours",
    text: "Hosted, shareable virtual tours for premium listings and buyers who need a stronger remote viewing experience.",
  },
];

const packages = REAL_ESTATE_PACKAGES.map((packageItem) => ({
  id: packageItem.id,
  title: `${packageItem.name} · ${packageItem.price}`,
  text: packageItem.text,
}));

const workflow = [
  "Send the property details, location, access notes, and preferred package.",
  "OpenÉire Studios confirms scope, weather, drone feasibility, and shoot timing.",
  "Photography, drone video, and virtual tour capture are completed according to the selected package.",
  "Edited media is delivered within 24 hours after the shoot once access and brief details are confirmed.",
];

const faqs = [
  {
    title: "Do prices include VAT?",
    text: "No. Prices are quoted exclusive of VAT. VAT at 23% is added at invoicing.",
  },
  {
    title: "How quickly will I receive the media?",
    text: "All packages are delivered within 24 hours after the shoot, once access and brief details have been provided.",
  },
  {
    title: "Can you fly the drone at every property?",
    text: "Aerial work depends on weather, site conditions, airspace restrictions, and safe operating limits. This is reviewed before confirming the shoot.",
  },
  {
    title: "Can I use the photos and videos on Daft.ie and social media?",
    text: "Yes. Packages include a commercial marketing licence for the property listing, including portals, agency websites, social media, email campaigns, and print brochures.",
  },
];

export default function RealEstatePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Real estate photography and drone video",
          provider: { "@type": "Organization", name: SITE_NAME },
          areaServed: "Connacht, Ireland",
          serviceType: "Property photography, aerial drone video, and 3D virtual tours",
          url: buildAbsoluteUrl("/real-estate"),
          description:
            "Professional real estate media for estate agents, developers, and private sellers across Connacht.",
        }}
      />
      <HeroSection
        eyebrow="Real estate media across Connacht"
        title="Property media built for Connacht agents"
        description="Professional real estate photography, aerial drone video, and 3D virtual tours for estate agents, developers, landlords, and private sellers who need clear pricing and polished listing media."
        image={PUBLIC_IMAGES.allGallery}
        actions={[
          { href: "/contact", label: "Request a Property Shoot" },
          { href: "#packages", label: "View Packages", variant: "secondary" },
        ]}
      />
      <PageSection
        eyebrow="Property media"
        title="Photography, drone video, and virtual tours"
        description="Capture the property, its setting, and its strongest selling points with media prepared for portals, agency websites, brochures, and social campaigns."
      >
        <CardGrid items={services} />
      </PageSection>
      <PageSection
        eyebrow="Packages"
        title="Clear real estate media packages"
        description="Packages are designed to make scope clear before the shoot. Custom work is available for multi-property, commercial, agricultural, and development briefs."
      >
        <div id="packages">
          <CardGrid items={packages} columns={2} />
        </div>
      </PageSection>
      <PageSection title="How a property shoot works">
        <NumberedSteps steps={workflow} />
      </PageSection>
      <PageSection title="Real estate media FAQ">
        <CardGrid items={faqs} columns={2} />
      </PageSection>
      <PageSection title="Operational notes">
        <TextPanel>
          <p>
            Drone capture is planned around safe operating conditions, weather,
            airspace restrictions, site access, and property context. If weather
            conditions fall outside safe operational limits within 48 hours of
            the shoot, the shoot can be rescheduled.
          </p>
        </TextPanel>
      </PageSection>
      <CtaBand
        title="Ready to plan a property shoot?"
        description="Send the property address, preferred package, and any access or timing notes so the shoot can be scoped safely and clearly."
        actions={[
          { href: "/contact", label: "Request a Property Shoot" },
          { href: "/licensing", label: "Review Licensing", variant: "secondary" },
        ]}
      />
    </>
  );
}
