import Link from "next/link";
import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { buildAbsoluteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "@/lib/seo/jsonLd";

export type FAQEntry = {
  question: string;
  answerLead: string;
  answerParagraphs?: string[];
  bullets?: string[];
  bridge?: ReactNode;
  schemaAnswer: string;
};

type CTA = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "tertiary";
};

function CTAButton({ label, href, variant = "primary" }: CTA) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 text-center font-bold text-black transition-colors hover:bg-accent"
      : variant === "secondary"
        ? "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10"
        : "inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-center text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white";

  return <Link href={href} className={className}>{label}</Link>;
}

export function FAQTopicPage({
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
}: {
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
}) {
  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "Home", url: buildAbsoluteUrl("/") },
        { name: "FAQ", url: buildAbsoluteUrl("/faq") },
        { name: breadcrumbLabel, url: buildAbsoluteUrl(canonicalPath) },
      ])} />
      <JsonLd data={buildFaqPageJsonLd(faqs.map((faq) => ({
        question: faq.question,
        answer: faq.schemaAnswer,
      })))} />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_55%),linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[url('/hero-poster.jpg')] bg-cover bg-center opacity-25" />
        <div className="header-safe-top container relative z-10 mx-auto px-4 pb-8 md:pb-20 lg:px-8">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              {eyebrow}
            </span>
            <h1 className="mt-5 max-w-3xl font-serif text-3xl font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl">
              {heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">{intro}</p>
            {supportingIntro ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">{supportingIntro}</p> : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-8 md:pt-16 lg:px-8">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">Frequently asked questions</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">Direct answers for buyers comparing options before they move further into the site.</p>
        <div className="mt-8 space-y-5">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-7">
              <h3 className="font-serif text-xl font-bold text-white md:text-2xl">{faq.question}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-200 md:text-base">{faq.answerLead}</p>
              {faq.answerParagraphs?.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-relaxed text-gray-300">{paragraph}</p>)}
              {faq.bullets?.length ? <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">{faq.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span>{bullet}</span></li>)}</ul> : null}
              {faq.bridge ? <div className="mt-4 text-sm leading-relaxed text-gray-400">{faq.bridge}</div> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pt-8 md:pt-20 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-linear-to-r from-white/8 to-white/5 p-5 md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8"><h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">{ctaTitle}</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">{ctaText}</p></div>
            <div className="flex flex-col gap-3 lg:col-span-4">{ctas.map((cta) => <CTAButton key={`${cta.href}-${cta.label}`} {...cta} />)}</div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 pt-8 md:pt-16 lg:px-8"><Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:text-white">Back to FAQ topics <FaArrowRight className="text-xs" /></Link></section>
    </div>
  );
}
