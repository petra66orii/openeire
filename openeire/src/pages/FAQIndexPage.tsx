import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFilm, FaPalette } from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import { buildAbsoluteSiteUrl } from "../config/site";
import { buildBreadcrumbSchema } from "../lib/seoSchema";

const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

const faqTopics = [
  {
    title: "Drone Footage Licensing FAQ",
    description:
      "Questions about pricing factors, rights-managed use, advertising, editorial licensing, and scope.",
    to: "/faq/drone-footage-licensing",
    icon: FaFilm,
  },
  {
    title: "Drone Footage Usage FAQ",
    description:
      "Questions about permission, ownership, social media use, personal vs commercial use, and editing.",
    to: "/faq/drone-footage-usage",
    icon: FaFilm,
  },
  {
    title: "Art Prints FAQ",
    description:
      "Questions about print buying, formats, gifting, shipping, and how physical print orders work.",
    to: "/faq/art-prints",
    icon: FaPalette,
  },
];

const FAQIndexPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <SEOHead
        title="FAQ | OpenEire Studios"
        description="Browse buyer FAQs about drone footage licensing, drone footage usage, and fine art prints from OpenEire Studios."
        canonicalPath="/faq"
        appendSiteTitle={false}
        schema={buildBreadcrumbSchema([
          { name: "Home", url: buildAbsoluteSiteUrl("/") },
          { name: "FAQ", url: buildAbsoluteSiteUrl("/faq") },
        ])}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0)_55%),linear-gradient(180deg,_rgba(0,0,0,0.16)_0%,_rgba(0,0,0,0.84)_100%)]" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] pb-8 sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pt-28 md:pb-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Buyer help and answers
            </span>
            <h1 className="mt-5 max-w-3xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl">
              Frequently asked questions for footage and art prints
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              A small FAQ directory for buyers comparing drone footage
              licensing, footage usage, and fine art print purchases.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-16">
        <div className="mb-8 max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>Choose a topic</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Start with the question type that matches what you are trying to
            decide.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {faqTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.to}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <Icon className="text-2xl text-accent" />
                <h3 className="mt-4 text-xl font-serif font-bold text-white">
                  {topic.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  {topic.description}
                </p>
                <Link
                  to={topic.to}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-white"
                >
                  Open topic <FaArrowRight className="text-xs" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQIndexPage;
