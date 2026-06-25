import Link from "next/link";
import { FaCheckCircle, FaRegImage, FaShippingFast } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import type { USLandingPage } from "@/lib/us/landingPages";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl } from "@/lib/site";

export function USPrintLandingPage({ page }: { page: USLandingPage }) {
  const path = `/us/${page.slug}`;

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "Home", url: buildAbsoluteUrl("/") },
        { name: "United States", url: buildAbsoluteUrl("/us") },
        { name: page.breadcrumbLabel, url: buildAbsoluteUrl(path) },
      ])} />
      {page.faqs?.length ? <JsonLd data={buildFaqPageJsonLd(page.faqs)} /> : null}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/hero-poster.jpg')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_55%),linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.82)_100%)]" />
        <div className="header-safe-top container relative z-10 mx-auto px-4 pb-8 md:pb-20 lg:px-8">
          <div className="max-w-5xl">
            <span className="inline-flex rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">{page.eyebrow}</span>
            <h1 className="mt-5 max-w-4xl font-serif text-3xl font-bold leading-[1.05] sm:text-4xl md:text-6xl">{page.heading}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">{page.intro}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/gallery/physical" className="rounded-full bg-brand-500 px-7 py-3.5 text-center font-bold text-black transition-colors hover:bg-accent">Browse Art Prints</Link><Link href="/us/fine-art-prints" className="rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10">View Fine Art Overview</Link></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-8 md:pt-16 lg:px-8">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">{page.angleTitle}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">{page.angleIntro}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">{page.cards.map((card) => <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6"><FaRegImage className="text-2xl text-accent" /><h3 className="mt-4 font-serif text-xl font-bold">{card.title}</h3><p className="mt-3 text-sm leading-relaxed text-gray-300">{card.text}</p></article>)}</div>
      </section>

      <section className="container mx-auto px-4 pt-8 md:pt-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7"><h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">{page.premiumTitle}</h2><p className="leading-relaxed text-gray-400">{page.premiumIntro}</p><div className="space-y-4">{page.premiumPoints.map((point) => <div key={point} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"><FaCheckCircle className="mt-0.5 shrink-0 text-accent" /><p className="text-sm leading-relaxed text-gray-300">{point}</p></div>)}</div></div>
          <aside className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6 lg:col-span-5"><h3 className="font-serif text-lg font-bold md:text-xl">{page.relevanceTitle}</h3><div className="mt-4 space-y-4">{page.relevanceParagraphs.map((text) => <p key={text} className="text-sm leading-relaxed text-gray-300">{text}</p>)}</div><ul className="mt-6 space-y-3">{page.relevanceBullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm text-gray-300"><FaShippingFast className="mt-0.5 shrink-0 text-accent" /><span>{bullet}</span></li>)}</ul></aside>
        </div>
      </section>

      {page.faqs?.length ? <section className="container mx-auto px-4 pt-8 md:pt-20 lg:px-8"><div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-8"><h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">Quick questions</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{page.faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-white/10 bg-black/35 p-5"><h3 className="font-serif text-lg font-bold">{faq.question}</h3><p className="mt-2 text-sm leading-relaxed text-gray-300">{faq.answer}</p></article>)}</div></div></section> : null}

      <section className="container mx-auto px-4 pt-8 md:pt-20 lg:px-8"><div className="rounded-[32px] border border-white/10 bg-linear-to-r from-white/8 to-white/5 p-5 md:p-10"><div className="grid gap-6 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-8"><h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">{page.ctaTitle}</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">{page.ctaText}</p></div><div className="flex flex-col gap-3 lg:col-span-4"><Link href="/gallery/physical" className="rounded-full bg-brand-500 px-7 py-3.5 text-center font-bold text-black hover:bg-accent">Browse Prints</Link><Link href="/contact" className="rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold hover:bg-white/10">Contact the Studio</Link><Link href="/art-prints" className="rounded-full border border-white/10 px-7 py-3.5 text-center text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white">Main Art Prints Page</Link></div></div></div></section>
    </div>
  );
}
