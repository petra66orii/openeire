import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PUBLIC_IMAGES } from "@/lib/assets";
import { SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { FaArrowRight, FaFileContract, FaHome } from "react-icons/fa";

export const metadata = buildPageMetadata({
  title: "Services | Commercial Licensing & Real Estate Media | OpenÉire Studios",
  description:
    "Choose between commercial aerial licensing and real estate photography, drone video, and virtual tour services from OpenÉire Studios.",
  path: "/services",
  image: PUBLIC_IMAGES.heroPoster,
});

const serviceCards = [
  {
    title: "Commercial Licensing",
    eyebrow: "Rights-managed aerial visuals",
    description:
      "License premium aerial photography and footage for campaigns, editorial projects, brand films, tourism, hospitality, and production work.",
    href: "/licensing",
    cta: "Explore Licensing",
    icon: <FaFileContract aria-hidden="true" />,
    image: PUBLIC_IMAGES.heroPoster,
    points: [
      "Commercial and editorial licence scopes",
      "Photo and video assets for campaign use",
      "Clear usage, territory, duration, and approval terms",
    ],
  },
  {
    title: "Real Estate Services",
    eyebrow: "Property media across Connacht",
    description:
      "Book professional real estate photography, aerial drone video, social cuts, and 3D virtual tours for property listings and developments.",
    href: "/real-estate",
    cta: "View Real Estate Services",
    icon: <FaHome aria-hidden="true" />,
    image: PUBLIC_IMAGES.irelandGallery,
    points: [
      "Interior, exterior, and aerial property media",
      "Clear package pricing for listings",
      "Listing-ready delivery for agents, developers, and sellers",
    ],
  },
] as const;

const servicesSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", url: buildAbsoluteUrl("/") },
    { name: "Services", url: buildAbsoluteUrl("/services") },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} services`,
    url: buildAbsoluteUrl("/services"),
    itemListElement: serviceCards.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: buildAbsoluteUrl("/"),
        },
        url: buildAbsoluteUrl(service.href),
      },
    })),
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd data={servicesSchema} />

      <section className="page-top-offset relative isolate overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${PUBLIC_IMAGES.heroPoster})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.22),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.38),#000)]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 py-12 text-center sm:py-16 lg:px-8">
          <p className="mx-auto w-fit rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-accent">
            Services
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-4xl font-bold leading-tight md:text-6xl">
            Choose your service path
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            Start with the route that matches your project: licence existing
            OpenÉire visuals, or commission new property media for a listing.
          </p>
        </div>
      </section>

      <section className="grid border-b border-white/10 lg:min-h-[62vh] lg:grid-cols-2">
        {serviceCards.map((service, index) => (
          <Link
            key={service.href}
            href={service.href}
            className={`group relative isolate flex min-h-[34rem] overflow-hidden ${
              index === 0 ? "lg:border-r lg:border-white/10" : ""
            } focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-black`}
            aria-label={`${service.cta}: ${service.title}`}
          >
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center opacity-[0.28] transition duration-500 group-hover:scale-105 group-hover:opacity-[0.35]"
              style={{ backgroundImage: `url(${service.image})` }}
              aria-hidden="true"
            />
            <div
              className={`absolute inset-0 -z-10 ${
                index === 0
                  ? "bg-[linear-gradient(135deg,rgba(0,0,0,0.9),rgba(8,47,73,0.74)),radial-gradient(circle_at_top_left,rgba(255,196,0,0.18),transparent_38%)]"
                  : "bg-[linear-gradient(135deg,rgba(0,0,0,0.9),rgba(5,46,22,0.75)),radial-gradient(circle_at_top_right,rgba(22,163,74,0.25),transparent_42%)]"
              }`}
              aria-hidden="true"
            />
            <div className="flex w-full flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16">
              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl text-accent shadow-xl shadow-black/25 backdrop-blur">
                  {service.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                  {service.eyebrow}
                </p>
                <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
                  {service.title}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-200 md:text-lg">
                  {service.description}
                </p>
                <ul className="mt-8 grid max-w-xl gap-4 text-sm text-gray-200 md:text-base">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500 shadow-[0_0_18px_rgba(22,163,74,0.65)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-brand-500 px-7 py-3 text-sm font-bold text-black transition-all group-hover:-translate-y-0.5 group-hover:bg-accent"
              >
                {service.cta} <FaArrowRight className="text-xs" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="container mx-auto px-4 py-10 text-center text-sm text-gray-400 lg:px-8">
        <p>
          Need help choosing?{" "}
          <Link href="/contact" className="font-semibold text-accent hover:text-accent-hover">
            Contact OpenÉire Studios
          </Link>{" "}
          and we will point you to the right path.
        </p>
      </section>
    </main>
  );
}
