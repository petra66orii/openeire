import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  CardGrid,
  CtaBand,
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
  FaFileContract,
  FaFilm,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

export const metadata = buildPageMetadata({
  title: "Commercial Aerial Footage Licensing | OpenÉire Studios",
  description:
    "Rights-managed aerial footage and photography licensing for brands, agencies and productions. Quoted by usage, territory and duration.",
  path: "/licensing",
});

const valueCards = [
  {
    icon: <FaFilm />,
    title: "Cinematic footage with commercial intent",
    text: "Designed for campaigns, brand films, and editorial use where the visual needs to feel polished and premium.",
  },
  {
    icon: <FaUsers />,
    title: "Clear scope for serious buyers",
    text: "We keep usage boundaries, territory, and duration easy to confirm before anything goes live.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Rights-managed from the start",
    text: "Copyright stays with OpenÉire Studios unless a separate written transfer is agreed. We confirm the exact use you need before anything is finalised.",
  },
];

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
  {
    title: "Editorial & publishing",
    text: "Aerial imagery for features, articles, and editorial storytelling where usage needs to stay clearly scoped.",
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
    title: "Personal use boundaries",
    text: "Private display and print purchases belong on the art print side of the site. Licensing is for business, editorial, or campaign usage.",
  },
];

const steps = [
  "Browse the footage library and find the asset that fits your brief.",
  "Open the photo or video page for that asset.",
  "Use the asset page to request a commercial licence with your usage details.",
  "We review scope, territory, duration, and pricing before confirming approval or any limits.",
  "Once approved, you complete payment and receive the written licence terms.",
];

const costFactors = [
  "Duration of use",
  "Territory and distribution region",
  "Media channels, such as web, social, print, broadcast, or paid ads",
  "Exclusivity requirements",
  "Campaign scope and reach",
  "Whether the use is commercial or editorial",
];

const protections = [
  "Copyright stays with OpenÉire Studios unless a separate written transfer is agreed.",
  "Resale, redistribution, sublicensing, and standalone file sharing are not allowed.",
  "AI training, model fine-tuning, dataset use, and synthetic generation use are prohibited.",
  "Written approval is required whenever the use falls outside the agreed scope.",
  "Full legal terms are available separately for buyers who need the agreement wording.",
];

const heroActions = [
  {
    href: "/gallery-gate?next=/gallery/digital",
    label: "Browse Footage & Choose Your Asset",
  },
  {
    href: "/contact",
    label: "Speak to the Studio",
    variant: "secondary" as const,
  },
];

export default function LicensingPage() {
  return (
    <div className="page-top-offset min-h-screen bg-black pb-20 text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Commercial aerial footage licensing",
          provider: { "@type": "Organization", name: SITE_NAME },
          areaServed: "Worldwide",
          serviceType:
            "Rights-managed aerial footage and photography licensing",
          url: buildAbsoluteUrl("/licensing"),
          description:
            "Rights-managed licensing for premium aerial footage and photography. Quotes are based on asset, usage, duration, territory, channel, exclusivity and commercial or editorial use.",
          additionalProperty: costFactors.map((factor) => ({
            "@type": "PropertyValue",
            name: "Licensing quote factor",
            value: factor,
          })),
        }}
      />
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={PUBLIC_IMAGES.heroLicensingPosterMobile}
          alt=""
          aria-hidden="true"
          fill
          priority
          className="absolute inset-0 -z-30 object-cover md:hidden"
          sizes="100vw"
        />
        <video
          className="absolute inset-0 -z-30 hidden h-full w-full object-cover md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={PUBLIC_IMAGES.heroLicensingPosterMobile}
          aria-label="Aerial video of the Irish coastline available for commercial licensing"
        >
          <source
            src={PUBLIC_IMAGES.heroLicensing}
            type="video/mp4"
            media="(min-width: 768px)"
          />
        </video>
        <div className="absolute inset-0 -z-20 bg-black/50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_42%),linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.64)_46%,rgba(0,0,0,0.24)_100%),linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.84)_100%)]" />
        <div className="container mx-auto px-4 pb-10 pt-8 md:pb-24 md:pt-12 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Commercial licensing for aerial visuals
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-3xl font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl">
              Premium aerial visuals licensed for brands, agencies, and
              productions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              Start by choosing the photo or video asset you want to use, then
              send the usage details from that asset page so we can confirm
              scope, pricing, and approval. OpenÉire Studios licenses premium
              aerial footage and photography on a rights-managed basis.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {heroActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.variant === "secondary"
                      ? "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      : "inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 text-center text-sm font-bold text-black transition-colors hover:bg-accent"
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400">
              Licensing starts with the asset you want to use. From that page,
              you can request a commercial licence with your usage details.
              Looking for available footage first? Start with{" "}
              <Link href="/footage" className="text-accent hover:text-white">
                the footage page
              </Link>{" "}
              to find the right asset.
            </div>
          </div>
        </div>
      </section>
      <PageSection>
        <CardGrid items={valueCards} />
      </PageSection>
      <PageSection title="Who this licensing page is for">
        <CardGrid items={audiences} columns={2} />
      </PageSection>
      <PageSection title="What affects licensing cost">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1fr)]">
          <div className="relative min-h-80 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
            <Image
              src={PUBLIC_IMAGES.licensingPoster1}
              alt="Slieve League cliffs photographed from above"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
          <TextPanel>
            <ul className="grid gap-3">
              {costFactors.map((item) => (
                <li key={item} className="flex gap-3">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TextPanel>
        </div>
      </PageSection>
      <PageSection title="How licensing works">
        <TextPanel>
          <div className="mb-6 flex items-center gap-3">
            <FaFileContract className="text-xl text-accent" />
            <span className="text-sm uppercase tracking-[0.24em] text-accent">
              Process
            </span>
          </div>
          <NumberedSteps steps={steps} mobileSwipe={false} />
        </TextPanel>
      </PageSection>
      <PageSection title="Licence routes">
        <CardGrid items={licenceTypes} />
      </PageSection>
      <PageSection title="What stays protected">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
          <TextPanel>
            <ul className="grid gap-3">
              {protections.map((point) => (
                <li key={point} className="flex gap-3">
                  <FaShieldAlt className="mt-0.5 shrink-0 text-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </TextPanel>
          <div className="relative min-h-80 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
            <Image
              src={PUBLIC_IMAGES.licensingPoster2}
              alt="Slieve League coastal landscape photographed for licensing"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </PageSection>
      <CtaBand
        title="Ready to choose the right asset?"
        description="Start with the footage library, then open the asset page to share your usage details and get the right scope confirmed."
        actions={[
          {
            href: "/gallery-gate?next=/gallery/digital",
            label: "Browse Footage & Choose Your Asset",
          },
          {
            href: "/contact",
            label: "Contact the Studio",
            variant: "secondary",
          },
          {
            href: "/licensing/terms",
            label: "Review Legal Terms",
            variant: "secondary",
          },
        ]}
      />
      <section className="container mx-auto px-4 pt-8 md:pt-20 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6">
          <h3 className="font-serif text-lg font-bold text-white md:text-xl">
            Looking for premium wall art instead?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            If your project is really about a collector piece, interior styling,
            or a gift, browse the art print collection rather than requesting a
            licence.
          </p>
          <Link
            href="/art-prints"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-accent"
          >
            Browse Art Prints <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </section>
    </div>
  );
}
