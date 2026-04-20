import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaShippingFast, FaPalette, FaExternalLinkAlt } from "react-icons/fa";
import SEOHead from "../components/SEOHead";
import { buildBreadcrumbSchema } from "../lib/seoSchema";
import {
  FREE_SHIPPING_COUNTRY_LABEL,
  FREE_SHIPPING_PROMO_ENABLED,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/freeShipping";

const BRAND_NAME = "OpenÉire Studios";
const HERO_TITLE_CLASS =
  "mt-5 max-w-3xl text-3xl font-serif font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl";
const SECTION_TITLE_CLASS =
  "text-2xl font-serif font-bold text-white sm:text-3xl md:text-4xl";

const ArtPrintsPage: React.FC = () => {
  const shippingNote = FREE_SHIPPING_PROMO_ENABLED
    ? `Shipping is calculated at checkout, and eligible ${FREE_SHIPPING_COUNTRY_LABEL} print orders over €${FREE_SHIPPING_THRESHOLD.toFixed(2)} qualify for free shipping.`
    : "Shipping is calculated at checkout for every bespoke print order.";

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <SEOHead
        title="Fine Art Prints Ireland | Premium Aerial Photography Artwork"
        description={`Discover premium fine art prints from ${BRAND_NAME}. Browse aerial photography artwork for collectors, interiors, and gifts, with bespoke production and shipping calculated at checkout.`}
        canonicalPath="/art-prints"
        schema={buildBreadcrumbSchema([
          { name: "Home", url: "https://openeire.ie/" },
          { name: "Art Prints", url: "https://openeire.ie/art-prints" },
        ])}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0)_55%),linear-gradient(180deg,_rgba(0,0,0,0.15)_0%,_rgba(0,0,0,0.72)_100%)]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url("/hero-poster.jpg")' }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] pb-8 sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pt-28 md:pb-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Art prints for collectors and interiors
            </span>
            <h1 className={HERO_TITLE_CLASS}>
              Fine art prints that feel as premium in the room as they do online.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              OpenÉire Studios prints aerial photography as statement wall art
              for homes, interiors, and gifting. Each piece is curated to feel
              editorial, distinctive, and built for long-term display.
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
                Request a Print Enquiry
              </Link>
            </div>

            <p className="mt-5 text-sm text-gray-400">{shippingNote}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-4 md:pt-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <FaPalette className="text-2xl text-accent" />
            <h2 className="mt-4 text-xl font-serif font-bold text-white">
              Artwork with a considered finish
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Every print is selected to hold detail, atmosphere, and presence
              in real interiors, not just on a thumbnail.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <FaCheckCircle className="text-2xl text-accent" />
            <h2 className="mt-4 text-xl font-serif font-bold text-white">
              Bespoke production, not mass-market stock
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Prints are produced to order through specialist fulfilment so the
              final piece arrives with gallery-level intent.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <FaShippingFast className="text-2xl text-accent" />
            <h2 className="mt-4 text-xl font-serif font-bold text-white">
              Clear shipping, clear expectations
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              {shippingNote}
            </p>
          </article>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pt-8 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className={SECTION_TITLE_CLASS}>
              Fine art prints for collectors, interiors, and thoughtful gifts.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The print collection is built for buyers looking for something
              more refined than a generic poster: aerial photography with
              atmosphere, premium production, and a visual language that suits
              modern interiors, curated spaces, and gift-worthy purchases.
            </p>
            <p className="text-gray-400 leading-relaxed">
              If you are looking for a particular landscape, scale, or finish,
              start with the gallery and then reach out through the contact page
              for a custom conversation.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/gallery/physical"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-accent"
              >
                Open the Print Gallery
              </Link>
              <Link
                to="/licensing"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Licensing
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[28px] border border-white/10 bg-black/40 p-5 md:p-6">
            <h3 className="text-lg font-serif font-bold text-white md:text-xl">
              Print buying notes
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-300">
              <li>Archival-minded art prints with a premium finish.</li>
              <li>Shipping is handled separately at checkout.</li>
              <li>Eligible {FREE_SHIPPING_COUNTRY_LABEL} orders over €{FREE_SHIPPING_THRESHOLD.toFixed(2)} qualify for free shipping.</li>
              <li>Need help choosing? Use the contact page for a direct enquiry.</li>
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-accent transition-colors hover:text-white"
            >
              Talk to the studio <FaExternalLinkAlt className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtPrintsPage;

