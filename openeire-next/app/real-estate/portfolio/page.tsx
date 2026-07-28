import Image from "next/image";
import Link from "next/link";
import {
  FaCamera,
  FaDraftingCompass,
  FaFilm,
  FaHelicopter,
  FaMobileAlt,
  FaPhotoVideo,
} from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { PortfolioProject } from "@/components/real-estate/PortfolioProject";
import { PortfolioTrackedLink } from "@/components/real-estate/PortfolioTrackedLink";
import {
  getPublishedPortfolioProjects,
} from "@/lib/realEstatePortfolio";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildPortfolioJsonLd,
  REAL_ESTATE_PORTFOLIO_DESCRIPTION,
  REAL_ESTATE_PORTFOLIO_TITLE,
} from "@/lib/seo/realEstatePortfolioJsonLd";

export const metadata = buildPageMetadata({
  title: REAL_ESTATE_PORTFOLIO_TITLE,
  description: REAL_ESTATE_PORTFOLIO_DESCRIPTION,
  path: "/real-estate/portfolio",
  image: "/hero-poster.jpg",
});

const services = [
  {
    icon: FaCamera,
    title: "Interior and exterior photography",
    text: "A considered sequence of rooms, details, exterior elevations and setting.",
  },
  {
    icon: FaHelicopter,
    title: "Aerial drone stills",
    text: "Elevated context for land, access, surroundings and wider location.",
  },
  {
    icon: FaFilm,
    title: "Aerial video",
    text: "Controlled aerial movement that helps establish scale and setting.",
  },
  {
    icon: FaPhotoVideo,
    title: "Ground property video",
    text: "A natural visual walkthrough shaped around the property and listing brief.",
  },
  {
    icon: FaMobileAlt,
    title: "Social-media cuts",
    text: "Purpose-made vertical and square edits for agent and listing channels.",
  },
  {
    icon: FaDraftingCompass,
    title: "Measured 2D floor plans",
    text: "Clear layout information supplied as an optional listing asset.",
  },
] as const;

const publishedProjects = getPublishedPortfolioProjects();

export default function RealEstatePortfolioPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <JsonLd data={buildPortfolioJsonLd(publishedProjects)} />

      <section className="relative isolate overflow-hidden pt-[calc(var(--site-header-height,96px)+2rem)]">
        <Image
          src="/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center opacity-30"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-black/65 via-black/85 to-black"
          aria-hidden="true"
        />
        <div className="container mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-20 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-accent">
              Real Estate Media Portfolio
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Present every property with clarity, care and a strong sense of
              place.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
              OpenÉire provides property photography, aerial media, ground
              video and practical listing assets for agents, auctioneers and
              vendors across Connacht.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <PortfolioTrackedLink
                href="/real-estate#enquiry"
                eventName="portfolio_enquiry_cta"
                eventLocation="hero"
                className="rounded-full bg-brand-500 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.17em] text-white shadow-xl shadow-brand-500/20 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Discuss a Property
              </PortfolioTrackedLink>
              <PortfolioTrackedLink
                href="/real-estate"
                eventName="portfolio_service_cta"
                eventLocation="hero"
                className="rounded-full border border-white/25 bg-black/25 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.17em] text-white backdrop-blur hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                View Services &amp; Packages
              </PortfolioTrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
            Coverage shaped around the listing
          </p>
          <div>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              The property sets the brief.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              Each property receives coverage tailored to its size, features,
              land, setting and marketing requirements. The aim is a coherent
              set of listing assets, not a one-size-fits-all shot list.
            </p>
          </div>
        </div>
      </section>

      {publishedProjects.length ? (
        <section aria-labelledby="featured-projects-heading">
          <div className="container mx-auto max-w-7xl px-4 pb-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Selected property work
            </p>
            <h2
              id="featured-projects-heading"
              className="mt-4 text-3xl font-bold md:text-5xl"
            >
              Featured projects
            </h2>
          </div>
          {publishedProjects.map((project) => (
            <PortfolioProject key={project.slug} project={project} />
          ))}
        </section>
      ) : (
        <section
          aria-labelledby="portfolio-preparation-heading"
          className="bg-gray-950 py-20"
        >
          <div className="container mx-auto max-w-5xl px-4 text-center lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">
              Selected recent work
            </p>
            <h2
              id="portfolio-preparation-heading"
              className="mt-4 text-3xl font-bold md:text-5xl"
            >
              Our property portfolio is being prepared for publication.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              We are reviewing image selections and written permissions before
              publishing client work. In the meantime, you can explore the
              media available for a property brief or discuss an upcoming
              listing directly.
            </p>
            <Link
              href="/real-estate"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Explore real estate services
            </Link>
          </div>
        </section>
      )}

      <section className="py-20" aria-labelledby="services-demonstrated-heading">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Media for the complete listing
            </p>
            <h2
              id="services-demonstrated-heading"
              className="mt-4 text-3xl font-bold md:text-5xl"
            >
              Services the portfolio is built to demonstrate.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-400">
              Select only the formats that support the property and its
              marketing plan.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title: serviceTitle, text }) => (
              <article
                key={serviceTitle}
                className="rounded-3xl border border-white/10 bg-gray-950 p-7"
              >
                <Icon className="text-2xl text-brand-500" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-bold">{serviceTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">{text}</p>
              </article>
            ))}
          </div>

          <PortfolioTrackedLink
            href="/real-estate"
            eventName="portfolio_service_cta"
            eventLocation="services"
            className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Compare services and packages
          </PortfolioTrackedLink>
        </div>
      </section>

      <section className="border-t border-white/10 bg-brand-900 py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            Scope the next listing
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Planning the next property listing?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-brand-100/80">
            Agents, auctioneers and vendors can submit the property details to
            receive a scope recommendation and an accurate quotation.
          </p>
          <PortfolioTrackedLink
            href="/real-estate#enquiry"
            eventName="portfolio_enquiry_cta"
            eventLocation="closing_cta"
            className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-bold uppercase tracking-[0.17em] text-black hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Send Property Details
          </PortfolioTrackedLink>
        </div>
      </section>
    </div>
  );
}
