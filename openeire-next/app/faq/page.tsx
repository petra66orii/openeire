import Link from "next/link";
import { FaArrowRight, FaFilm, FaPalette } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildAbsoluteUrl } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "FAQ | OpenÉire Studios",
  description: "Browse buyer FAQs about drone footage licensing, drone footage usage, and fine art prints from OpenÉire Studios.",
  path: "/faq",
});

const topics = [
  { title: "Drone Footage Licensing FAQ", description: "Questions about pricing factors, rights-managed use, advertising, editorial licensing, and scope.", href: "/faq/drone-footage-licensing", icon: FaFilm },
  { title: "Drone Footage Usage FAQ", description: "Questions about permission, ownership, social media use, personal vs commercial use, and editing.", href: "/faq/drone-footage-usage", icon: FaFilm },
  { title: "Art Prints FAQ", description: "Questions about print buying, formats, gifting, shipping, and how physical print orders work.", href: "/faq/art-prints", icon: FaPalette },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", url: buildAbsoluteUrl("/") }, { name: "FAQ", url: buildAbsoluteUrl("/faq") }])} />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_55%),linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.84)_100%)]" />
        <div className="page-top-offset container relative z-10 mx-auto px-4 pb-8 md:pb-20 lg:px-8">
          <span className="inline-flex rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Buyer help and answers</span>
          <h1 className="mt-5 max-w-3xl font-serif text-3xl font-bold leading-[1.05] sm:text-4xl md:text-6xl">Frequently asked questions for footage and art prints</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">A small FAQ directory for buyers comparing drone footage licensing, footage usage, and fine art print purchases.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 pt-8 md:pt-16 lg:px-8">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">Choose a topic</h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">Start with the question type that matches what you are trying to decide.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {topics.map((topic) => { const Icon = topic.icon; return <article key={topic.href} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"><Icon className="text-2xl text-accent" /><h3 className="mt-4 font-serif text-xl font-bold">{topic.title}</h3><p className="mt-3 text-sm leading-relaxed text-gray-300">{topic.description}</p><Link href={topic.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent hover:text-white">Open topic <FaArrowRight className="text-xs" /></Link></article>; })}
        </div>
      </section>
    </div>
  );
}
