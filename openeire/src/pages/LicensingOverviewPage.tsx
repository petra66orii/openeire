import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaFilm,
  FaShieldAlt,
  FaUsers,
  FaFileContract,
} from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import { buildBreadcrumbSchema } from "../lib/seoSchema";

const BRAND_NAME = "OpenÉire Studios";
const HERO_TITLE_CLASS =
  "mt-5 max-w-3xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl";
const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

const audienceBuckets = [
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

const howItWorks = [
  "Browse the footage library and find the asset that fits your brief.",
  "Open the photo or video page for that asset.",
  "Use the asset page to request a commercial licence with your usage details.",
  "We review scope, territory, duration, and pricing before confirming approval or any limits.",
  "Once approved, you complete payment and receive the written licence terms.",
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

const costFactors = [
  "Duration of use",
  "Territory and distribution region",
  "Media channels, such as web, social, print, broadcast, or paid ads",
  "Exclusivity requirements",
  "Campaign scope and reach",
  "Whether the use is commercial or editorial",
];

const trustPoints = [
  "Copyright stays with OpenÉire Studios unless a separate written transfer is agreed.",
  "Resale, redistribution, sublicensing, and standalone file sharing are not allowed.",
  "AI training, model fine-tuning, dataset use, and synthetic generation use are prohibited.",
  "Written approval is required whenever the use falls outside the agreed scope.",
  "Full legal terms are available separately for buyers who need the agreement wording.",
];

const LicensingOverviewPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <SEOHead
        title="Commercial Aerial Footage Licensing | OpenÉire Studios"
        description={`Explore premium aerial footage and photography from ${BRAND_NAME} for commercial and editorial use in Ireland and beyond. Start with the asset, then request a scoped licence from its page.`}
        canonicalPath="/licensing"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "https://openeire.ie/" },
          { name: "Licensing", url: "https://openeire.ie/licensing" },
        ])}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0)_55%),linear-gradient(180deg,_rgba(0,0,0,0.18)_0%,_rgba(0,0,0,0.82)_100%)]" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] pb-8 sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pt-28 md:pb-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Commercial licensing for aerial visuals
            </span>
            <h1 className={HERO_TITLE_CLASS}>
              Premium aerial visuals licensed for brands, agencies, and
              productions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              {BRAND_NAME} licenses premium aerial footage and photography on a
              rights-managed basis. Start by choosing the photo or video asset
              you want to use, then send the usage details from that asset page
              so we can confirm scope, pricing, and approval.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/gallery/digital"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black text-center transition-colors hover:bg-accent"
              >
                Browse Footage & Choose Your Asset
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Speak to the Studio
              </Link>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              Licensing starts with the asset you want to use. From that page,
              you can request a commercial licence with your usage details.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300">
              {[
                "Rights-managed",
                "Commercial + editorial use",
                "Reviewed before approval",
                "Custom scopes available",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-black/35 px-3 py-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-6 md:pt-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <FaFilm className="text-2xl text-accent" />
            <h2 className="mt-4 text-xl font-serif font-bold text-white">
              Cinematic footage with commercial intent
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Designed for campaigns, brand films, and editorial use where the
              visual needs to feel polished and premium.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <FaUsers className="text-2xl text-accent" />
            <h2 className="mt-4 text-xl font-serif font-bold text-white">
              Clear scope for serious buyers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              We keep usage boundaries, territory, and duration easy to confirm
              before anything goes live.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <FaShieldAlt className="text-2xl text-accent" />
            <h2 className="mt-4 text-xl font-serif font-bold text-white">
              Rights-managed from the start
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Copyright stays with OpenÉire Studios unless a separate written
              transfer is agreed. We confirm the exact use you need before
              anything is finalised.
            </p>
          </article>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className={SECTION_TITLE_CLASS}>
              Who this licensing page is for
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {audienceBuckets.map((bucket) => (
                <article
                  key={bucket.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-serif font-bold text-white">
                    {bucket.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    {bucket.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[28px] border border-white/10 bg-black/40 p-6">
            <h3 className="text-xl font-serif font-bold text-white">
              What affects licensing cost
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">
              {costFactors.map((item) => (
                <li key={item} className="flex gap-3">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-gray-400">
              If the scope changes after launch, talk to us first so the usage
              stays properly covered.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-8">
          <div className="flex items-center gap-3">
            <FaFileContract className="text-xl text-accent" />
            <h2 className={SECTION_TITLE_CLASS}>How licensing works</h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {howItWorks.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-black/35 p-5"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Step {index + 1}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="grid gap-6 md:grid-cols-3">
          {licenceTypes.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h3 className="text-xl font-serif font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <h2 className={SECTION_TITLE_CLASS}>What stays protected</h2>
            <div className="space-y-4">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <FaShieldAlt className="mt-0.5 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-gray-300">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6">
            <h3 className="text-lg font-serif font-bold text-white md:text-xl">
              Looking for premium wall art instead?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              If your project is really about a collector piece, interior
              styling, or a gift, browse the art print collection rather than
              requesting a licence.
            </p>
            <Link
              to="/art-prints"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-accent"
            >
              Browse Art Prints <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-white/8 to-white/5 p-5 md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className={SECTION_TITLE_CLASS}>
                Ready to choose the right asset?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
                Start with the footage library, then open the asset page to
                share your usage details and get the right scope confirmed.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link
                to="/gallery/digital"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black text-center transition-colors hover:bg-accent"
              >
                Browse Footage & Choose Your Asset
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact the Studio
              </Link>
              <Link
                to="/licensing/terms"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Review Legal Terms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LicensingOverviewPage;
