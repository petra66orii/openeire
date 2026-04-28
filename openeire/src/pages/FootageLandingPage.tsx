import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaFilm,
  FaMapMarkedAlt,
  FaNewspaper,
} from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import { buildAbsoluteSiteUrl } from "../config/site";
import { buildBreadcrumbSchema, buildFAQPageSchema } from "../lib/seoSchema";

const HERO_TITLE_CLASS =
  "mt-5 max-w-3xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl";
const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

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
    title: "Drone footage for tourism marketing",
    text: "Show destination, scale, and mood for visitor campaigns, hospitality launches, and regional storytelling.",
  },
  {
    title: "Aerial video for real estate and development",
    text: "Give sites, surroundings, and landscape context to property presentations, development marketing, and location-led pitches.",
  },
  {
    title: "Drone footage for documentaries",
    text: "Support narrative work with place-setting visuals that help establish geography, atmosphere, and movement.",
  },
  {
    title: "Aerial footage for brand campaigns",
    text: "Use cinematic Irish scenery when a campaign needs premium visual source material rather than filler b-roll.",
  },
  {
    title: "Drone video for social media advertising",
    text: "Find short-form aerial visuals that still feel polished enough for paid social, launch edits, and branded content.",
  },
  {
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
    text: "OpenEire footage is positioned as premium source material for serious use, not interchangeable filler.",
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
    to: "/blog/how-to-license-drone-footage-in-ireland-complete-guide",
  },
  {
    title: "How much drone footage costs in Ireland",
    description:
      "A helpful overview of the factors buyers usually compare before moving into licensing.",
    to: "/blog/how-much-does-drone-footage-cost-in-ireland",
  },
  {
    title: "Personal vs commercial drone footage use",
    description:
      "A clear explainer for people working out whether their intended use needs a commercial route.",
    to: "/blog/personal-vs-commercial-drone-footage-what-youre-actually-allowed-to-do",
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

const FootageLandingPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <SEOHead
        title="Drone Footage Ireland | Licensed Aerial Footage | OpenÉire Studios"
        description="Browse licensed drone footage from Ireland for commercial, editorial, and creative use. Premium aerial video with clear licensing options."
        canonicalPath="/footage"
        schema={[
          buildBreadcrumbSchema([
            { name: "Home", url: buildAbsoluteSiteUrl("/") },
            { name: "Footage", url: buildAbsoluteSiteUrl("/footage") },
          ]),
          buildFAQPageSchema(faqItems),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0)_55%),linear-gradient(180deg,_rgba(0,0,0,0.18)_0%,_rgba(0,0,0,0.84)_100%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("/ireland-gallery.webp")' }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] pb-8 sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pt-28 md:pb-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Licensed aerial footage from Ireland
            </span>
            <h1 className={HERO_TITLE_CLASS}>
              Licensed Drone Footage from Ireland
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              Browse premium aerial footage captured in Ireland for campaigns,
              productions, editorial projects, and creative use. This page is
              built for buyers who need to discover the right drone footage
              first, then move into licensing when the asset is right.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/gallery/digital"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black text-center transition-colors hover:bg-accent"
              >
                Browse Available Footage
              </Link>
              <Link
                to="/licensing"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Review Licensing Options
              </Link>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400">
              Need tailored usage for a campaign, documentary, or brand brief?
              Browse the footage first, then continue to{" "}
              <Link to="/licensing" className="text-accent hover:text-white">
                licensing
              </Link>{" "}
              or{" "}
              <Link to="/contact" className="text-accent hover:text-white">
                contact the studio
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-6 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-7">
            <h2 className={SECTION_TITLE_CLASS}>What footage you can find</h2>
            <p className="text-gray-400 leading-relaxed">
              The footage collection focuses on cinematic aerials from Ireland
              that are location-specific, commercially usable, and designed for
              real production work — from tourism campaigns to editorial
              storytelling.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {footageCategories.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-serif font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              All footage is captured with a focus on safe operation, clean
              composition, and real-world usability for commercial and editorial
              projects.
            </p>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6 lg:col-span-5">
            <h3 className="text-lg font-serif font-bold text-white md:text-xl">
              What kind of drone footage can you find?
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">
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
            <p className="mt-6 text-sm leading-relaxed text-gray-400">
              Browse footage first. When you have the right asset, use{" "}
              <Link to="/licensing" className="text-accent hover:text-white">
                licensing
              </Link>{" "}
              to confirm the usage route.
            </p>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="mb-8 max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>
            Popular use cases for drone footage
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            This footage is meant to help buyers move from search intent to a
            shortlist, whether the brief is commercial, editorial, or
            production-led.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <FaFilm className="text-2xl text-accent" />
              <h3 className="mt-4 text-xl font-serif font-bold text-white">
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
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-7">
            <h2 className={SECTION_TITLE_CLASS}>Why choose OpenEire footage</h2>
            <p className="text-gray-400 leading-relaxed">
              OpenÉire Studios positions aerial footage as premium source
              material for serious use. The goal here is not to overwhelm you
              with legal detail before you have even found the right shot. It is
              to help you find footage that feels location-specific, cinematic,
              and commercially useful.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {trustReasons.map((reason) => (
                <article
                  key={reason.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-serif font-bold text-white">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    {reason.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <FaMapMarkedAlt className="text-xl text-accent" />
              <h3 className="text-lg font-serif font-bold text-white md:text-xl">
                Discovery first
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              Use this page to explore what kind of drone footage is available
              from Ireland and where it may fit.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Once the footage is right for the brief, the next step is
              straightforward: go to{" "}
              <Link to="/licensing" className="text-accent hover:text-white">
                licensing
              </Link>{" "}
              to confirm the usage route.
            </p>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-8">
          <div className="flex items-center gap-3">
            <FaArrowRight className="text-xl text-accent" />
            <h2 className={SECTION_TITLE_CLASS}>How to get started</h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {gettingStartedSteps.map((step, index) => (
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
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/gallery/digital"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-accent"
            >
              Browse Footage
            </Link>
            <Link
              to="/licensing"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Go to Licensing
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="mb-8 max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>Learn before you license</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            These guides help buyers compare options, understand the route into
            usage approval, and ask better questions before they request a
            licence.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {learningLinks.map((item) => (
            <article
              key={item.to}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-3 text-accent">
                <FaNewspaper className="text-lg" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Buyer guide
                </span>
              </div>
              <h3 className="mt-4 text-xl font-serif font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {item.description}
              </p>
              <Link
                to={item.to}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-white"
              >
                Read article <FaArrowRight className="text-xs" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-white/8 to-white/5 p-5 md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <h2 className={SECTION_TITLE_CLASS}>Footage FAQ</h2>
              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-2xl border border-white/10 bg-black/35 p-5"
                  >
                    <h3 className="text-lg font-serif font-bold text-white">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-5 lg:pl-6">
              <Link
                to="/gallery/digital"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black text-center transition-colors hover:bg-accent"
              >
                Browse Footage
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ask About a Footage Brief
              </Link>
              <Link
                to="/licensing"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Compare Licensing Routes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FootageLandingPage;
