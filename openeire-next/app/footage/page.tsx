import Link from "next/link";
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
import {
  FaArrowRight,
  FaCheckCircle,
  FaFilm,
  FaMapMarkedAlt,
  FaNewspaper,
} from "react-icons/fa";

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
    title: "Harbours and waterfronts",
    text: "Wide aerial views of ports, marinas, and waterfront areas that capture structure, layout, and atmosphere without relying on close urban proximity.",
  },
  {
    title: "Towns and wider location views",
    text: "Place-led aerials that show how a location sits in its environment — useful for destination marketing, editorial features, and production context.",
  },
  {
    title: "Cinematic establishing shots",
    text: "Wide aerial visuals designed to set tone, geography, and atmosphere for films, documentaries, and branded productions.",
  },
  {
    title: "Campaign-ready scenic footage",
    text: "Premium aerial material for brands, agencies, and productions that need distinctive visuals rather than generic stock clips.",
  },
];

const useCases = [
  {
    icon: <FaFilm />,
    title: "Drone footage for tourism marketing",
    text: "Show destination, scale, and mood for visitor campaigns, hospitality launches, and regional storytelling.",
  },
  {
    icon: <FaFilm />,
    title: "Aerial video for real estate and development",
    text: "Give sites, surroundings, and landscape context to property presentations, development marketing, and location-led pitches.",
  },
  {
    icon: <FaFilm />,
    title: "Drone footage for documentaries",
    text: "Support narrative work with place-setting visuals that help establish geography, atmosphere, and movement.",
  },
  {
    icon: <FaFilm />,
    title: "Aerial footage for brand campaigns",
    text: "Use cinematic Irish scenery when a campaign needs premium visual source material rather than filler b-roll.",
  },
  {
    icon: <FaFilm />,
    title: "Drone video for social media advertising",
    text: "Find short-form aerial visuals that still feel polished enough for paid social, launch edits, and branded content.",
  },
  {
    icon: <FaFilm />,
    title: "Editorial aerial footage",
    text: "Browse footage suited to publishing, features, and editorial projects where location and visual credibility matter.",
  },
];

const trustReasons = [
  {
    title: "Captured in Ireland",
    text: "Real aerial footage from Ireland, with the geography and atmosphere buyers expect when the location matters.",
  },
  {
    title: "Cinematic quality",
    text: "Built for campaigns, productions, and editorial work that need stronger source material than a generic stock library clip.",
  },
  {
    title: "Premium, not disposable",
    text: "OpenÉire footage is positioned as premium source material for serious use, not interchangeable filler.",
  },
  {
    title: "Clear path to licensing",
    text: "When you find the right asset, there is a straightforward route into licensing without turning discovery into legal admin too early.",
  },
  {
    title: "Direct studio access",
    text: "If your brief needs something more tailored, you can move from browsing into a direct conversation with the studio.",
  },
];

const gettingStartedSteps = [
  "Browse the footage library and shortlist the assets that fit your brief.",
  "Choose the right footage for the project, campaign, or editorial use you have in mind.",
  "Request the right licence from the asset page or through the licensing page when you are ready.",
];

const learningLinks = [
  {
    title: "How to license drone footage in Ireland",
    description:
      "A practical guide for buyers comparing usage options before they request approval.",
    href: "/blog/how-to-license-drone-footage-in-ireland-complete-guide",
  },
  {
    title: "How much drone footage costs in Ireland",
    description:
      "A helpful overview of the factors buyers usually compare before moving into licensing.",
    href: "/blog/how-much-does-drone-footage-cost-in-ireland",
  },
  {
    title: "Personal vs commercial drone footage use",
    description:
      "A clear explainer for people working out whether their intended use needs a commercial route.",
    href: "/blog/personal-vs-commercial-drone-footage-what-youre-actually-allowed-to-do",
  },
];

const faqItems = [
  {
    question: "Can I license drone footage for commercial use?",
    answer:
      "Yes. Commercial licensing is available when you are ready to move from browsing into confirmed usage.",
  },
  {
    question: "What affects the cost of licensed aerial footage?",
    answer:
      "Usage details such as project scope, media, and territory affect cost, with the full breakdown handled on the licensing page.",
  },
  {
    question: "Is drone footage available for editorial use?",
    answer:
      "Yes. Editorial aerial footage may be available for suitable publishing, documentary, and reporting contexts.",
  },
  {
    question: "What kind of drone footage can I find from Ireland?",
    answer:
      "You can browse coastlines, cliffs, beaches, countryside, towns, landmarks, and cinematic establishing shots captured in Ireland.",
  },
];

export default function FootagePage() {
  return (
    <div className="page-top-offset min-h-screen bg-black pb-20 text-white">
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
        title="Licensed Drone Footage from Ireland"
        description="Browse premium aerial footage captured in Ireland for campaigns, productions, editorial projects, and creative use. This page is built for buyers who need to discover the right drone footage first, then move into licensing when the asset is right."
        image={PUBLIC_IMAGES.irelandGallery}
        actions={[
          { href: "/gallery/digital", label: "Browse Available Footage" },
          {
            href: "/licensing",
            label: "Review Licensing Options",
            variant: "secondary",
          },
        ]}
        note={
          <>
            Need tailored usage for a campaign, documentary, or brand brief?
            Browse the footage first, then continue to{" "}
            <Link href="/licensing" className="text-accent hover:text-white">
              licensing
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-accent hover:text-white">
              contact the studio
            </Link>
            .
          </>
        }
      />
      <PageSection
        title="What footage you can find"
        description="The footage collection focuses on cinematic aerials from Ireland that are location-specific, commercially usable, and designed for real production work — from tourism campaigns to editorial storytelling."
      >
        <CardGrid items={footageCategories} columns={2} />
      </PageSection>
      <PageSection title="What kind of drone footage can you find?">
        <TextPanel>
          <ul className="grid gap-3">
            {[
              "Coastlines",
              "Cliffs",
              "Beaches",
              "Towns and cities",
              "Irish countryside",
              "Campaign-ready establishing shots",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </TextPanel>
      </PageSection>
      <PageSection
        title="Popular use cases for drone footage"
        description="This footage is meant to help buyers move from search intent to a shortlist, whether the brief is commercial, editorial, or production-led."
      >
        <CardGrid items={useCases} />
      </PageSection>
      <PageSection
        title="Why choose OpenÉire footage"
        description="OpenÉire Studios positions aerial footage as premium source material for serious use. The goal here is not to overwhelm you with legal detail before you have even found the right shot. It is to help you find footage that feels location-specific, cinematic, and commercially useful."
      >
        <CardGrid items={trustReasons} columns={2} />
      </PageSection>
      <PageSection title="Discovery first">
        <TextPanel>
          <div className="flex items-center gap-3">
            <FaMapMarkedAlt className="text-xl text-accent" />
            <h3 className="font-serif text-lg font-bold text-white md:text-xl">
              Discovery first
            </h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-300">
            Use this page to explore what kind of drone footage is available
            from Ireland and where it may fit.
          </p>
        </TextPanel>
      </PageSection>
      <PageSection title="How to get started">
        <NumberedSteps steps={gettingStartedSteps} />
      </PageSection>
      <PageSection
        title="Learn before you license"
        description="These guides help buyers compare options, understand the route into usage approval, and ask better questions before they request a licence."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {learningLinks.map((item) => (
            <article
              key={item.href}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-3 text-accent">
                <FaNewspaper className="text-lg" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Buyer guide
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-white"
              >
                Read article <FaArrowRight className="text-xs" />
              </Link>
            </article>
          ))}
        </div>
      </PageSection>
      <PageSection title="Footage FAQ">
        <CardGrid
          items={faqItems.map((item) => ({
            title: item.question,
            text: item.answer,
          }))}
          columns={2}
        />
      </PageSection>
      <CtaBand
        title="Find footage before you license"
        description="Start with the available footage library, then move into commercial or editorial licensing once the right asset is clear."
        actions={[
          { href: "/gallery/digital", label: "Browse Footage" },
          {
            href: "/contact",
            label: "Ask About a Footage Brief",
            variant: "secondary",
          },
          {
            href: "/licensing",
            label: "Compare Licensing Routes",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
