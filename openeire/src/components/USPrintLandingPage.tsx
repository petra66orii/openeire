import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaShippingFast,
} from "react-icons/fa";
import SEOHead from "./SEOHead";
import { buildAbsoluteSiteUrl } from "../config/site";
import { buildBreadcrumbSchema, buildFAQPageSchema } from "../lib/seoSchema";

const HERO_TITLE_CLASS =
  "mt-5 max-w-4xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl";
const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

type InfoCard = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

type CTA = {
  label: string;
  to: string;
  variant?: "primary" | "secondary" | "tertiary";
};

type FAQItem = {
  question: string;
  answer: string;
};

interface USPrintLandingPageProps {
  title: string;
  description: string;
  canonicalPath: string;
  breadcrumbLabel: string;
  eyebrow: string;
  heading: string;
  intro: React.ReactNode;
  heroPrimaryCta: CTA;
  heroSecondaryCta: CTA;
  heroNote?: React.ReactNode;
  angleTitle: string;
  angleIntro: React.ReactNode;
  angleCards: InfoCard[];
  premiumTitle: string;
  premiumIntro: React.ReactNode;
  premiumPoints: React.ReactNode[];
  relevanceTitle: string;
  relevanceParagraphs: React.ReactNode[];
  relevanceBullets: string[];
  relevanceNote?: React.ReactNode;
  ctaTitle: string;
  ctaText: React.ReactNode;
  ctas: CTA[];
  faqs?: FAQItem[];
}

const CTAButton: React.FC<CTA> = ({ label, to, variant = "primary" }) => {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black transition-colors hover:bg-accent"
      : variant === "secondary"
        ? "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
        : "inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white";

  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
};

const USPrintLandingPage: React.FC<USPrintLandingPageProps> = ({
  title,
  description,
  canonicalPath,
  breadcrumbLabel,
  eyebrow,
  heading,
  intro,
  heroPrimaryCta,
  heroSecondaryCta,
  heroNote,
  angleTitle,
  angleIntro,
  angleCards,
  premiumTitle,
  premiumIntro,
  premiumPoints,
  relevanceTitle,
  relevanceParagraphs,
  relevanceBullets,
  relevanceNote,
  ctaTitle,
  ctaText,
  ctas,
  faqs,
}) => {
  const schema = [
    buildBreadcrumbSchema([
      { name: "Home", url: buildAbsoluteSiteUrl("/") },
      { name: breadcrumbLabel, url: buildAbsoluteSiteUrl(canonicalPath) },
    ]),
  ];

  if (faqs?.length) {
    schema.push(buildFAQPageSchema(faqs));
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0)_55%),linear-gradient(180deg,_rgba(0,0,0,0.14)_0%,_rgba(0,0,0,0.82)_100%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url("/hero-poster.jpg")' }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] pb-8 sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pt-28 md:pb-20">
          <div className="max-w-5xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              {eyebrow}
            </span>
            <h1 className={HERO_TITLE_CLASS}>{heading}</h1>
            <div className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
              {intro}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTAButton {...heroPrimaryCta} />
              <CTAButton {...heroSecondaryCta} />
            </div>

            {heroNote ? (
              <div className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-400">
                {heroNote}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-6 md:pt-16">
        <div className="mb-8 max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>{angleTitle}</h2>
          <div className="mt-4 text-sm leading-relaxed text-gray-400">
            {angleIntro}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {angleCards.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div className="text-2xl text-accent">{item.icon}</div>
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
          <div className="space-y-5 lg:col-span-7">
            <h2 className={SECTION_TITLE_CLASS}>{premiumTitle}</h2>
            <div className="text-gray-400 leading-relaxed">{premiumIntro}</div>
            <div className="space-y-4">
              {premiumPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                  <div className="text-sm leading-relaxed text-gray-300">
                    {point}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6 lg:col-span-5">
            <h3 className="text-lg font-serif font-bold text-white md:text-xl">
              {relevanceTitle}
            </h3>
            <div className="mt-4 space-y-4">
              {relevanceParagraphs.map((paragraph, index) => (
                <div
                  key={index}
                  className="text-sm leading-relaxed text-gray-300"
                >
                  {paragraph}
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-gray-300">
              {relevanceBullets.map((bullet, index) => (
                <li key={`${canonicalPath}-bullet-${index}`} className="flex gap-3">
                  <FaShippingFast className="mt-0.5 shrink-0 text-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {relevanceNote ? (
              <div className="mt-6 text-sm leading-relaxed text-gray-400">
                {relevanceNote}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {faqs?.length ? (
        <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-8">
            <h2 className={SECTION_TITLE_CLASS}>Quick questions</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
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
        </section>
      ) : null}

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-white/8 to-white/5 p-5 md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className={SECTION_TITLE_CLASS}>{ctaTitle}</h2>
              <div className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
                {ctaText}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              {ctas.map((cta) => (
                <CTAButton key={`${cta.label}-${cta.to}`} {...cta} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default USPrintLandingPage;
