import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaHome,
  FaMapMarkedAlt,
  FaRegImage,
  FaShippingFast,
} from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import { buildAbsoluteSiteUrl } from "../config/site";
import { buildBreadcrumbSchema, buildFAQPageSchema } from "../lib/seoSchema";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/freeShipping";

const HERO_TITLE_CLASS =
  "mt-5 max-w-4xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl";
const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

const interiorReasons = [
  {
    title: "Statement wall art",
    text: "Designed to hold presence in a living room, hallway, office, or hospitality setting without feeling mass-produced.",
  },
  {
    title: "Editorial atmosphere",
    text: "Aerial landscapes with mood, negative space, and tonal restraint that work naturally in considered interiors.",
  },
  {
    title: "Premium finish",
    text: "Produced to order so the final piece feels closer to collected wall art than off-the-shelf poster commerce.",
  },
];

const placementIdeas = [
  "Living rooms",
  "Home offices",
  "Hospitality interiors",
  "Hallway statement walls",
  "Gift-worthy spaces",
];

const faqItems = [
  {
    question: "Do you ship fine art prints to the United States?",
    answer:
      "Yes. Fine art prints are available to buyers in the United States, with shipping handled through the current checkout flow.",
  },
  {
    question: "Are these original aerial photography prints?",
    answer:
      "Yes. The collection centers on original aerial photography curated by OpenÉire Studios rather than generic stock wall art.",
  },
  {
    question: "Are prints suitable for collectors and interior spaces?",
    answer:
      "Yes. The collection is intended for collectors, design-led interiors, and buyers looking for a more distinctive statement piece.",
  },
];

const USFineArtPrintsPage: React.FC = () => {
  const shippingNote = FREE_SHIPPING_PROMO_ENABLED
    ? `Shipping is calculated at checkout. Current free-shipping messaging applies to eligible ${FREE_SHIPPING_COUNTRY_LABEL} orders over EUR ${FREE_SHIPPING_THRESHOLD.toFixed(2)}, while United States orders are handled through the same made-to-order print flow.`
    : "Shipping is calculated at checkout for each made-to-order print.";

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <SEOHead
        title="Fine Art Landscape Prints USA | Aerial Wall Art | OpenÉire Studios"
        description="Premium aerial fine art prints shipped to the United States. Landscape wall art from Ireland in curated formats for collectors, interiors, and distinctive spaces."
        canonicalPath="/us/fine-art-prints"
        schema={[
          buildBreadcrumbSchema([
            { name: "Home", url: buildAbsoluteSiteUrl("/") },
            {
              name: "US Fine Art Prints",
              url: buildAbsoluteSiteUrl("/us/fine-art-prints"),
            },
          ]),
          buildFAQPageSchema(faqItems),
        ]}
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
              Fine art prints shipped to the United States
            </span>
            <h1 className={HERO_TITLE_CLASS}>
              Fine Art Prints for Collectors and Interiors in the United States
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
              Discover premium aerial wall art from OpenÉire Studios, available
              to buyers in the United States. These fine art prints are made for
              interiors, collectors, and gift buyers who want landscape artwork
              with atmosphere rather than generic decor.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/gallery/physical"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black transition-colors hover:bg-accent"
              >
                Browse Art Prints
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ask About a Print
              </Link>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-400">
              Looking for the broader collection first? Visit{" "}
              <Link to="/art-prints" className="text-accent hover:text-white">
                art prints
              </Link>{" "}
              for the main overview, then return here for the United
              States-focused version.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-6 md:pt-16">
        <div className="mb-8 max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>
            Why these prints work in real interiors
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Built for buyers in the United States who want fine art prints,
            landscape wall art, and premium aerial photography that can sit
            naturally in considered spaces.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {interiorReasons.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <FaRegImage className="text-2xl text-accent" />
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
            <h2 className={SECTION_TITLE_CLASS}>Shipping and buying details</h2>
            <p className="text-gray-400 leading-relaxed">
              These prints are made for rooms that need a focal point. The
              aerial viewpoint brings scale and calm, while the overall finish
              stays restrained enough to work in design-led homes, offices, and
              hospitality spaces.
            </p>
            <p className="text-gray-400 leading-relaxed">
              For buyers in the United States, the appeal comes from original
              aerial photography, premium presentation, and landscapes that feel
              more distinctive than generic wall art.
            </p>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6 lg:col-span-5">
            <h3 className="text-lg font-serif font-bold text-white md:text-xl">
              Shipping to the United States
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">
              <li className="flex gap-3">
                <FaShippingFast className="mt-0.5 shrink-0 text-accent" />
                <span>
                  Prints are available to buyers in the United States.
                </span>
              </li>
              <li className="flex gap-3">
                <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                <span>
                  Each piece is produced to order rather than pulled from mass
                  inventory.
                </span>
              </li>
              <li className="flex gap-3">
                <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                <span>{shippingNote}</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className={SECTION_TITLE_CLASS}>
                Sizes and display language for US buyers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                The collection suits United States interiors that often shop by
                room scale and wall impact. Product pages remain the source of
                truth for exact print options, while this page helps frame the
                decision: multiple size routes, premium display intent, and
                artwork that can anchor a room rather than simply fill space.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Where buyers think in inches, the goal is not one fixed
                dimension but choosing a format that fits a statement wall,
                console arrangement, office backdrop, or collector-style
                display.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-5 lg:col-span-5">
              <h3 className="text-lg font-serif font-bold text-white">
                Best fit for
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">
                {placementIdeas.map((item) => (
                  <li key={item} className="flex gap-3">
                    <FaHome className="mt-0.5 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-5 lg:col-span-7">
            <h2 className={SECTION_TITLE_CLASS}>Why choose OpenÉire Studios</h2>
            <div className="space-y-4">
              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <FaMapMarkedAlt className="mt-0.5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-gray-300">
                  Original aerial photography with a point of view, drawn from
                  landscapes in Ireland and beyond.
                </p>
              </div>
              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <FaCheckCircle className="mt-0.5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-gray-300">
                  Premium production and curated selection, positioned for
                  collectors and interiors rather than commodity wall decor.
                </p>
              </div>
              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <FaArrowRight className="mt-0.5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-gray-300">
                  From here, you can move straight into the main{" "}
                  <Link
                    to="/art-prints"
                    className="text-accent hover:text-white"
                  >
                    art prints
                  </Link>{" "}
                  overview, the print gallery, or a direct print enquiry.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6 lg:col-span-5">
            <h3 className="text-lg font-serif font-bold text-white md:text-xl">
              Explore the collection
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Start here, then continue into the wider collection when you want
              to browse pieces in more detail.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/gallery/physical"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-accent"
              >
                Open the Print Gallery
              </Link>
              <Link
                to="/art-prints"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Visit the Main Art Prints Page
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                About the Studio
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-white/8 to-white/5 p-5 md:p-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <h2 className={SECTION_TITLE_CLASS}>Fine art prints USA FAQ</h2>
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
                to="/gallery/physical"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 font-bold text-black transition-colors hover:bg-accent"
              >
                Browse Fine Art Prints
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact for Print Enquiries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default USFineArtPrintsPage;
