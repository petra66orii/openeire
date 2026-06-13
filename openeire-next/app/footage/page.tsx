import { JsonLd } from "@/components/JsonLd";
import {
  CardGrid,
  CtaBand,
  HeroSection,
  NumberedSteps,
  PageSection,
} from "@/components/marketing/MarketingPage";
import { PUBLIC_IMAGES } from "@/lib/assets";
import { SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Drone Footage Ireland | Licensed Aerial Footage | OpenÉire Studios",
  description:
    "Browse licensed drone footage from Ireland for commercial, editorial, and creative use. Premium aerial video with clear licensing options.",
  path: "/footage",
  image: PUBLIC_IMAGES.irelandGallery,
});

const footageCategories = [
  {
    title: "Coastlines and cliffs",
    text: "Atlantic coastlines, rugged cliffs, and coastal passes suited to tourism campaigns, documentaries, and cinematic establishing shots.",
  },
  {
    title: "Beaches and shoreline movement",
    text: "Aerial beach footage with texture, tide, and scale for travel edits, brand storytelling, and location-driven visuals.",
  },
  {
    title: "Irish countryside",
    text: "Fields, lakes, rural roads, and open landscapes that work for scenic footage, slower editorial pacing, and campaign backdrops.",
  },
  {
    title: "Cinematic establishing shots",
    text: "Wide aerial visuals designed to set tone, geography, and atmosphere for films, documentaries, and branded productions.",
  },
];

const useCases = [
  {
    title: "Tourism marketing",
    text: "Show destination, scale, and mood for visitor campaigns, hospitality launches, and regional storytelling.",
  },
  {
    title: "Real estate and development",
    text: "Give sites, surroundings, and landscape context to property presentations, development marketing, and location-led pitches.",
  },
  {
    title: "Documentary and editorial",
    text: "Support narrative work with place-setting visuals that help establish geography, atmosphere, and movement.",
  },
];

const steps = [
  "Browse the footage library and shortlist the assets that fit your brief.",
  "Choose the footage for the project, campaign, or editorial use you have in mind.",
  "Request the right licence from the asset page or through the licensing page.",
];

export default function FootagePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Licensed drone footage from Ireland",
          url: buildAbsoluteUrl("/footage"),
          description:
            "Premium aerial footage from Ireland for commercial, editorial, tourism, property, and production use.",
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <HeroSection
        eyebrow="Licensed aerial footage from Ireland"
        title="Licensed drone footage from Ireland"
        description="Browse premium aerial footage captured in Ireland for campaigns, productions, editorial projects, and creative use. Discover the right drone footage first, then move into licensing when the asset is right."
        image={PUBLIC_IMAGES.irelandGallery}
        actions={[
          { href: "/gallery/digital", label: "Browse Available Footage" },
          { href: "/licensing", label: "Review Licensing Options", variant: "secondary" },
        ]}
      />
      <PageSection
        eyebrow="Footage library"
        title="What footage you can find"
        description="The footage collection focuses on cinematic aerials from Ireland that are location-specific, commercially usable, and designed for real production work."
      >
        <CardGrid items={footageCategories} columns={2} />
      </PageSection>
      <PageSection title="Popular use cases for drone footage">
        <CardGrid items={useCases} />
      </PageSection>
      <PageSection
        eyebrow="Discovery first"
        title="How to get started"
        description="Browse footage first. When you have the right asset, the next step is licensing the usage route."
      >
        <NumberedSteps steps={steps} />
      </PageSection>
      <CtaBand
        title="Find footage before you license"
        description="Start with the available footage library, then move into commercial or editorial licensing once the right asset is clear."
        actions={[
          { href: "/gallery/digital", label: "Browse Footage" },
          { href: "/contact", label: "Ask About a Footage Brief", variant: "secondary" },
          { href: "/licensing", label: "Compare Licensing Routes", variant: "secondary" },
        ]}
      />
    </>
  );
}
