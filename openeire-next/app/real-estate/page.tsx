import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SwipeHint } from "@/components/marketing/MarketingPage";
import { RealEstateHeroImage } from "@/components/real-estate/RealEstateHeroImage";
import { RealEstateEnquiryForm } from "@/components/real-estate/RealEstateEnquiryForm";
import {
  DEFAULT_SOCIAL_IMAGE_PATH,
  ORGANIZATION_LOGO_PATH,
  SITE_CONTACT_EMAIL,
  SITE_NAME,
  SITE_NAME_ASCII,
  buildAbsoluteUrl,
  getOfficialSameAsLinks,
} from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY,
  REAL_ESTATE_PACKAGES,
  REAL_ESTATE_RUSH_DELIVERY_LABEL,
  REAL_ESTATE_RUSH_DELIVERY_NOTE,
  REAL_ESTATE_STANDARD_TURNAROUND_COPY,
  REAL_ESTATE_TURNAROUND_CONTEXT,
  REAL_ESTATE_VAT_NOTE,
} from "@/lib/realEstate";
import { REAL_ESTATE_PORTFOLIO_PATH } from "@/lib/realEstatePresentation";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildOpenEireLocalBusinessJsonLd,
} from "@/lib/seo/jsonLd";
import {
  FaCalendarAlt,
  FaCamera,
  FaCheckCircle,
  FaChevronDown,
  FaHome,
  FaMapMarkerAlt,
  FaVideo,
} from "react-icons/fa";

type RealEstatePackage = {
  key: string;
  name: string;
  price: string;
  badge?: string;
  description: string;
  features: readonly string[];
};

const realEstatePhotoAllowances = REAL_ESTATE_PACKAGES.flatMap(
  ({ includedPhotographs }) =>
    includedPhotographs === null ? [] : [includedPhotographs],
).join(", ");

export const metadata = buildPageMetadata({
  title: "Real Estate Photography & Drone Video in Connacht | OpenÉire Studios",
  description: `Real estate photography packages with ${realEstatePhotoAllowances} professionally edited photographs, drone video and 3D tours across Connacht, with package-aware business-day turnaround.`,
  path: "/real-estate",
});

const packages: readonly RealEstatePackage[] = REAL_ESTATE_PACKAGES.map(
  (packageItem) => ({
    key: packageItem.id,
    name: packageItem.name,
    price: packageItem.price,
    badge: "badge" in packageItem ? packageItem.badge : undefined,
    description: packageItem.description,
    features: packageItem.features,
  }),
);

const listingFeatures = [
  {
    icon: <FaCamera />,
    title: "Portal-ready images",
    text: "Clean interior and exterior photography prepared for property portals, agency websites, brochures and social media.",
  },
  {
    icon: <FaVideo />,
    title: "Aerial video",
    text: "Drone video for rural homes, waterfront sites, new builds, larger properties and listings where the setting matters.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Package-aware turnaround",
    text: REAL_ESTATE_STANDARD_TURNAROUND_COPY,
  },
  {
    icon: <FaHome />,
    title: "Clear pricing",
    text: "Transparent packages from €175 total with optional add-ons only where the listing needs them.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Licence included",
    text: "Commercial marketing use is included for the property listing across portals, agency websites, social media, email campaigns and brochures.",
  },
] as const;

const addOns = [
  {
    label: "Additional edited photographs",
    price: "€10 total per photograph",
  },
  {
    label: "Floor plan, 2D measured (included in Premium package)",
    price: "€75 total",
  },
  {
    label: "3D virtual tour, hosted (included in Premium package)",
    price: "€150 total",
  },
  {
    label: REAL_ESTATE_RUSH_DELIVERY_LABEL,
    price: "€75 total",
  },
  {
    label: "Extended drone video, up to 3 minutes, fully edited",
    price: "€150 total",
  },
  {
    label: "Additional social media cuts, extra formats or edits",
    price: "€50 total",
  },
  {
    label: "Travel supplement beyond 40 km from base",
    price: "€0.50 total per km",
  },
] as const;

const processSteps = [
  {
    title: "1. Send us the property details",
    text: "Choose a package and share the address, property type, preferred date and any access notes.",
  },
  {
    title: "2. We review and confirm",
    text: "We check the brief, location and any airspace requirements, then confirm the shoot date and package with you within 24 hours.",
  },
  {
    title: "3. We capture and edit the media",
    text: "Photography, drone video and virtual tour capture are completed according to the selected package.",
  },
  {
    title: "4. You receive listing-ready files",
    text: "Final media is delivered by secure download link, ready for portals, websites, social media and brochures.",
  },
] as const;

const faqs = [
  {
    question: "Do prices include VAT?",
    answer: REAL_ESTATE_VAT_NOTE,
  },
  {
    question: "How quickly will I receive the media?",
    answer: `${REAL_ESTATE_STANDARD_TURNAROUND_COPY} ${REAL_ESTATE_TURNAROUND_CONTEXT}`,
  },
  {
    question: "Can you fly the drone at every property?",
    answer:
      "Aerial work depends on weather, site conditions, airspace restrictions and safe operating limits. We review this before confirming the shoot.",
  },
  {
    question: "Can you work on active construction sites?",
    answer:
      "Yes. A valid Safe Pass is held for construction-site access. All work remains subject to the site manager’s induction, access requirements and safety procedures.",
  },
  {
    question: "Is OpenÉire commercially insured?",
    answer:
      "OpenÉire is fully insured for commercial drone operations, with public liability cover of up to €6.5 million per occurrence.",
  },
  {
    question: "What happens if the weather is unsuitable?",
    answer:
      "If weather or safety conditions fall outside safe operational limits, OpenÉire will offer one reschedule at no additional cost. Further reschedules may incur a fee.",
  },
  {
    question: "Can I use the photos and videos on Daft.ie and social media?",
    answer:
      "Yes. All packages include a commercial marketing licence for the specific property listing, across property portals, your agency website, social media, email campaigns and print brochures. The licence is non-transferable and ends when the listing is sold, let or withdrawn, or after 2 years (whichever comes first).",
  },
  {
    question: "Can another agent use the same photos and video?",
    answer:
      "No. The licence is granted to the booking agent for that specific instruction only. If a different agent lists the property, they will need to arrange their own shoot or licence agreement with OpenÉire Studios.",
  },
  {
    question: "Do you cover all of Connacht?",
    answer:
      "OpenÉire Studios is based in Connacht. Standard pricing applies within 40 km of base, with a travel supplement beyond that.",
  },
  {
    question: "Can you photograph multiple properties on the same day?",
    answer:
      "Yes. Multi-property days are available on a Custom quotation basis. Send us the property list and locations, and we’ll prepare a tailored quote.",
  },
] as const;

const realEstatePackageOffers = REAL_ESTATE_PACKAGES.map((packageItem) => ({
  name: `${packageItem.name} real estate media package`,
  description: `${packageItem.price}. Includes ${packageItem.text} ${REAL_ESTATE_VAT_NOTE}`,
  ...(packageItem.priceAmount !== null
    ? { price: String(packageItem.priceAmount) }
    : {}),
}));

const schema = [
  buildBreadcrumbJsonLd([
    { name: "Home", url: buildAbsoluteUrl("/") },
    {
      name: "Real Estate Media",
      url: buildAbsoluteUrl("/real-estate"),
    },
  ]),
  buildFaqPageJsonLd(
    faqs.map(({ question, answer }) => ({ question, answer })),
  ),
  buildOpenEireLocalBusinessJsonLd({
    name: SITE_NAME,
    alternateName: SITE_NAME_ASCII,
    url: buildAbsoluteUrl("/"),
    logo: buildAbsoluteUrl(ORGANIZATION_LOGO_PATH),
    image: buildAbsoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH),
    email: SITE_CONTACT_EMAIL,
    sameAs: getOfficialSameAsLinks(),
  }),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": buildAbsoluteUrl("/real-estate#service"),
    name: `${SITE_NAME} Real Estate Media`,
    url: buildAbsoluteUrl("/real-estate"),
    description:
      "Professional real estate photography, aerial drone video and 3D virtual tours for estate agents, developers and private sellers across Connacht.",
    serviceType: [
      "Real estate photography",
      "Drone photography",
      "Drone videography",
      "3D virtual tours",
    ],
    areaServed: ["Connacht", "Galway", "Mayo", "Roscommon", "Sligo", "Leitrim"],
    provider: {
      "@id": `${buildAbsoluteUrl("/").replace(/\/+$/, "")}/#localbusiness`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Real estate media packages",
      itemListElement: realEstatePackageOffers.map((offer, index) => ({
        "@type": "Offer",
        position: index + 1,
        name: offer.name,
        description: offer.description,
        url: buildAbsoluteUrl("/real-estate#packages"),
        availability: "https://schema.org/InStock",
        ...("price" in offer && offer.price
          ? {
              price: offer.price,
              priceCurrency: "EUR",
            }
          : {}),
      })),
    },
  },
];

export default function RealEstatePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <JsonLd data={schema} />

      <section className="relative isolate overflow-hidden pt-[calc(var(--site-header-height,96px)+2rem)]">
        <RealEstateHeroImage objectPositionClassName="object-[64%_center] sm:object-[68%_center] lg:object-[72%_center]" />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-r from-black/95 via-black/75 to-black/45 md:from-black/90 md:via-black/60 md:to-black/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-transparent to-black/65"
          aria-hidden="true"
        />
        <div className="container mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-20 lg:px-8">
          <div className="max-w-3xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              <FaMapMarkerAlt aria-hidden="true" />
              Real estate media across Connacht
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Property media built for Connacht agents — photography, drone
              video and 3D tours with clear pricing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              One visit, listing-ready media and a clear package-aware
              turnaround — for estate agents, developers and private sellers
              across Connacht.
            </p>
            <p className="mt-4 max-w-2xl text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Interior & exterior photography • Aerial drone video • Social
              media cuts • 3D virtual tours
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#enquiry"
                className="rounded-full bg-brand-500 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Request a Property Shoot
              </a>
              <Link
                href={REAL_ESTATE_PORTFOLIO_PATH}
                className="rounded-full border border-white/30 bg-black/25 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
              >
                View property portfolio
              </Link>
            </div>
            <a
              href="#packages"
              className="mt-5 inline-flex text-sm font-bold text-gray-200 underline decoration-white/35 underline-offset-4 transition hover:text-accent hover:decoration-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Compare packages and pricing
            </a>
          </div>
        </div>
      </section>

      <section
        aria-label="Property media service assurances"
        className="border-y border-white/10 bg-gray-950"
      >
        <div className="container mx-auto grid max-w-7xl gap-px px-4 py-5 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
          {[
            "Photography packages from €175 total",
            "Commercial marketing licence included",
            "Package-aware business-day turnaround",
            "Drone capture subject to safe conditions",
            "Valid Safe Pass held for construction-site access",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 border-white/10 py-3 sm:px-4 sm:odd:border-r lg:border-r lg:last:border-r-0"
            >
              <FaCheckCircle
                className="mt-0.5 shrink-0 text-brand-500"
                aria-hidden="true"
              />
              <span className="text-sm leading-6 text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Built for property listings
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Give every listing a stronger first impression.
            </h2>
          </div>
          <SwipeHint className="md:hidden" />
          <div className="mobile-snap-row grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {listingFeatures.map((item) => (
              <div
                key={item.title}
                className="mobile-snap-card rounded-3xl border border-white/10 bg-gray-950 p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-xl text-brand-500">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="scroll-mt-32 bg-gray-950 py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Clear package pricing
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Choose the media package that fits the listing.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-400">
              {REAL_ESTATE_VAT_NOTE} Travel
              supplement applies beyond 40 km from base.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              {REAL_ESTATE_TURNAROUND_CONTEXT}
            </p>
          </div>

          <SwipeHint className="md:hidden" />
          <div className="mobile-snap-row grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
            {packages.map((item) => (
              <div
                key={item.key}
                className={`mobile-snap-card mobile-snap-card-wide relative flex flex-col rounded-[1.75rem] border p-6 ${
                  item.badge
                    ? "border-brand-500 bg-brand-500/10 shadow-2xl shadow-brand-500/10"
                    : "border-white/10 bg-black"
                }`}
              >
                {item.badge ? (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-brand-500 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
                    {item.badge}
                  </span>
                ) : null}
                <h3 className="font-serif text-2xl font-bold">{item.name}</h3>
                <p className="mt-2 text-2xl font-black text-accent">
                  {item.price}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-300">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <FaCheckCircle
                        className="mt-1 shrink-0 text-brand-500"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`/real-estate?package=${item.key}#enquiry`}
                  className="mt-8 rounded-full border border-white/20 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Enquire
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20">
        <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Add-ons
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Add only what the listing needs.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-400">
              Build a clean scope around the property rather than paying for
              extras you do not need.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-amber-100">
              {REAL_ESTATE_RUSH_DELIVERY_NOTE}
            </p>
          </div>
          <SwipeHint className="md:hidden" />
          <div className="mobile-snap-row grid gap-4 md:grid-cols-2">
            {addOns.map((item) => (
              <div
                key={item.label}
                className="mobile-snap-card rounded-2xl border border-white/10 bg-gray-950 p-5"
              >
                <h3 className="font-bold">{item.label}</h3>
                <p className="mt-2 text-sm text-brand-500">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <SwipeHint className="md:hidden" />
          <div className="mobile-snap-row grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item) => (
              <div
                key={item.title}
                className="mobile-snap-card rounded-3xl border border-white/10 bg-gray-950 p-7"
              >
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 leading-relaxed text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-accent/20 bg-accent/10 p-6 text-sm leading-relaxed text-gray-200">
            Aerial work is planned around weather, site conditions, airspace
            restrictions and safe operating limits. If weather conditions are
            unsuitable, OpenÉire will offer one reschedule at no additional
            cost. Further reschedules may incur a fee.
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center lg:px-8">
          <FaHome
            className="mx-auto mb-5 text-3xl text-brand-500"
            aria-hidden="true"
          />
          <h2 className="font-serif text-3xl font-bold md:text-5xl">
            Built for property teams who need clarity.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-gray-400">
            Built for estate agents, developers and private sellers who need
            listing-ready media without unclear pricing or slow turnaround.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Questions
            </p>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">
              Real estate media FAQ
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-white/10 bg-gray-950 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.question}
                  <FaChevronDown
                    className="shrink-0 text-brand-500 transition group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RealEstateEnquiryForm />
    </div>
  );
}
