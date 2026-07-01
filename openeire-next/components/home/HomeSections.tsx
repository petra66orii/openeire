/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  FaFileContract,
  FaHome,
  FaImage,
  FaShieldAlt,
  FaVideo,
} from "react-icons/fa";
import { PUBLIC_IMAGES } from "@/lib/assets";

const services = [
  {
    title: "Fine Art Prints",
    description:
      "Museum-quality aerial and landscape prints from Ireland, made for collectors, interiors, and thoughtful gifts.",
    link: "/art-prints",
    cta: "Shop Prints",
    icon: <FaImage className="h-10 w-10 text-paper" />,
  },
  {
    title: "Commercial Licensing",
    description:
      "Rights-managed aerial footage and imagery for brands, agencies, filmmakers, and editorial projects that need a clear usage scope.",
    link: "/licensing",
    cta: "Explore Licensing",
    icon: <FaFileContract className="h-10 w-10 text-paper" />,
  },
  {
    title: "Property Media",
    description:
      "Real estate photography, drone video, and 3D virtual tours for agents, developers, landlords, and private sellers across Connacht.",
    link: "/real-estate",
    cta: "View Real Estate Services",
    icon: <FaHome className="h-10 w-10 text-paper" />,
  },
  {
    title: "4K Stock Footage",
    description:
      "Cinematic aerial stock footage from Ireland and beyond, ready for documentary, brand, editorial, and commercial licensing work.",
    link: "/gallery-gate?next=/gallery/digital",
    cta: "Browse Clips",
    icon: <FaVideo className="h-10 w-10 text-paper" />,
  },
];

export function HomeHeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-x-hidden text-center"
      style={{
        minHeight: "100svh",
        boxSizing: "border-box",
        paddingTop: "calc(var(--site-header-height, 0px) + 1rem)",
        paddingBottom: "2rem",
      }}
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={PUBLIC_IMAGES.heroPoster}
          className="hero-motion-video absolute left-0 top-0 h-full w-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <img
          src={PUBLIC_IMAGES.heroPoster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="hero-motion-poster absolute left-0 top-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <div className="animate-fade-in-up relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="glass rounded-3xl border border-white/10 bg-black/20 px-5 py-10 shadow-2xl backdrop-blur-md sm:px-6 sm:py-12 md:px-12 md:py-20">
          <span className="mb-6 inline-block rounded-full border border-accent/60 bg-black/40 px-4 py-1 text-xs font-bold tracking-widest text-accent shadow-sm">
            Est. 2026 {"\u2022"} Ireland
          </span>

          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl">
            Capturing the World <br />
            <span className="bg-gradient-to-r from-brand-500 via-white to-accent bg-clip-text pb-2 text-transparent drop-shadow-lg filter">
              From Above
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl font-sans text-base font-light leading-relaxed text-gray-100 drop-shadow-sm sm:text-lg md:text-xl">
            Premium fine art prints, commercial licensing, and cinematic aerial
            footage. <br className="hidden md:block" />
            Curated from the rugged coasts of Ireland and beyond for collectors,
            interiors, brands, agencies, and filmmakers.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 font-sans sm:flex-row sm:flex-wrap sm:gap-5">
            <Link
              href="/art-prints"
              className="w-full max-w-xs rounded-full border border-transparent bg-brand-700 px-8 py-4 font-bold text-white shadow-lg shadow-brand-700/40 transition-all hover:scale-105 hover:bg-brand-800 sm:w-auto"
            >
              Shop Fine Art Prints
            </Link>

            <Link
              href="/services"
              className="w-full max-w-xs rounded-full border border-white/20 bg-black/20 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/30 sm:w-auto"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-20 w-full bg-gradient-to-t from-dark to-transparent md:h-48" />
    </section>
  );
}

export function HomeServicesSection() {
  return (
    <section className="bg-dark py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl pt-10 text-center md:pt-0">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            What We Do
          </span>
          <h2 className="mb-6 mt-3 font-serif text-3xl font-bold text-white md:text-4xl">
            Fine art prints, property media, commercial licensing, and aerial
            footage
          </h2>
          <p className="font-sans leading-relaxed text-gray-400">
            Whether you need a statement print for a space, rights-managed
            visuals for a campaign, real estate media, or drone footage in
            Ireland, we deliver uncompromising quality.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-gray-700 bg-dark p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 inline-block rounded-2xl bg-brand-500 p-4 transition-colors duration-300 group-hover:bg-accent-hover">
                <div className="transition-colors duration-300 group-hover:text-white">
                  {service.icon}
                </div>
              </div>

              <h3 className="mb-3 font-serif text-xl font-bold text-white">
                {service.title}
              </h3>

              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                {service.description}
              </p>

              <Link
                href={service.link}
                className="inline-flex items-center text-sm font-bold uppercase tracking-wide text-brand-500 transition-colors hover:text-accent"
              >
                {service.cta} <span className="ml-2 text-lg">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCertsSection() {
  return (
    <section className="relative overflow-hidden border-t border-brand-700 bg-brand-900 py-12 text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-5">
        <svg width="100%" height="100%" aria-hidden="true">
          <pattern
            id="cert-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cert-grid)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="mb-2 flex items-center justify-center gap-3 font-serif text-2xl font-bold md:justify-start">
              <FaShieldAlt className="text-accent" />
              Fully Certified & Insured
            </h2>
            <p className="max-w-md text-sm text-brand-100">
              We operate with strict adherence to EU aviation safety standards.
              Safety is our priority on every flight.
            </p>
          </div>

          <div className="flex items-center gap-6 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="mb-1 block text-3xl font-bold text-white">
                IAA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Irish Aviation Authority
              </span>
            </div>
            <div className="hidden h-10 w-px bg-brand-700 md:block" />
            <div className="flex flex-col items-center">
              <span className="mb-1 block text-3xl font-bold text-white">
                EASA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                EU Aviation Safety
              </span>
            </div>
            <div className="hidden h-10 w-px bg-brand-700 md:block" />
            <div className="flex flex-col items-center">
              <span className="mb-1 block text-3xl font-bold text-white">
                €6.5M
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent">
                Public Liability Insurance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
