import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import SEOHead from "./SEOHead";
import { buildAbsoluteSiteUrl } from "../config/site";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  StructuredData,
} from "../lib/seoSchema";

const HERO_TITLE_CLASS =
  "mt-5 max-w-3xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl";
const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

type FAQEntry = {
  question: string;
  answerLead: string;
  answerParagraphs?: string[];
  bullets?: string[];
  bridge?: React.ReactNode;
  schemaAnswer: string;
};

type CTA = {
  label: string;
  to: string;
  variant?: "primary" | "secondary" | "tertiary";
};

interface FAQTopicPageProps {
  title: string;
  description: string;
  canonicalPath: string;
  breadcrumbLabel: string;
  eyebrow: string;
  heading: string;
  intro: string;
  supportingIntro?: string;
  faqs: FAQEntry[];
  ctaTitle: string;
  ctaText: string;
  ctas: CTA[];
  extraSchema?: StructuredData[];
}

const CTAButton: React.FC<CTA> = ({ label, to, variant = "primary" }) => {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black text-center transition-colors hover:bg-accent"
      : variant === "secondary"
        ? "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
        : "inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white";

  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
};

const FAQTopicPage: React.FC<FAQTopicPageProps> = ({
  title,
  description,
  canonicalPath,
  breadcrumbLabel,
  eyebrow,
  heading,
  intro,
  supportingIntro,
  faqs,
  ctaTitle,
  ctaText,
  ctas,
  extraSchema,
}) => {
  const schema: StructuredData[] = [
    buildBreadcrumbSchema([
      { name: "Home", url: buildAbsoluteSiteUrl("/") },
      { name: "FAQ", url: buildAbsoluteSiteUrl("/faq") },
      { name: breadcrumbLabel, url: buildAbsoluteSiteUrl(canonicalPath) },
    ]),
    buildFAQPageSchema(
      faqs.map((item) => ({
        question: item.question,
        answer: item.schemaAnswer,
      })),
    ),
  ];

  if (extraSchema) {
    schema.push(...extraSchema);
  }

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <SEOHead
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        appendSiteTitle={false}
        schema={schema}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0)_55%),linear-gradient(180deg,_rgba(0,0,0,0.18)_0%,_rgba(0,0,0,0.84)_100%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url("/hero-poster.jpg")' }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] pb-8 sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pt-28 md:pb-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              {eyebrow}
            </span>
            <h1 className={HERO_TITLE_CLASS}>{heading}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              {intro}
            </p>
            {supportingIntro ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
                {supportingIntro}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-16">
        <div className="mb-8 max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>Frequently asked questions</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Direct answers for buyers comparing options before they move
            further into the site.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((item) => (
            <article
              key={item.question}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-7"
            >
              <h3 className="text-xl font-serif font-bold text-white md:text-2xl">
                {item.question}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-200 md:text-base">
                {item.answerLead}
              </p>
              {item.answerParagraphs?.map((paragraph, index) => (
                <p
                  key={`${item.question}-paragraph-${index}`}
                  className="mt-3 text-sm leading-relaxed text-gray-300"
                >
                  {paragraph}
                </p>
              ))}
              {item.bullets?.length ? (
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">
                  {item.bullets.map((bullet, index) => (
                    <li
                      key={`${item.question}-bullet-${index}`}
                      className="flex gap-3"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.bridge ? (
                <div className="mt-4 text-sm leading-relaxed text-gray-400">
                  {item.bridge}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-white/8 to-white/5 p-5 md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className={SECTION_TITLE_CLASS}>{ctaTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
                {ctaText}
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4">
              {ctas.map((cta) => (
                <CTAButton key={`${cta.to}-${cta.label}`} {...cta} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-16">
        <Link
          to="/faq"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-white"
        >
          Back to FAQ topics <FaArrowRight className="text-xs" />
        </Link>
      </section>
    </div>
  );
};

export type { FAQEntry, CTA };
export default FAQTopicPage;
