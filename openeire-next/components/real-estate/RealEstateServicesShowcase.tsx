"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
import {
  FaCamera,
  FaChevronDown,
  FaCube,
  FaDraftingCompass,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaPlay,
} from "react-icons/fa";
import { REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE } from "@/lib/realEstate";
import { REAL_ESTATE_PORTFOLIO_PATH } from "@/lib/realEstatePresentation";

type ServiceId =
  | "photography"
  | "aerial"
  | "film"
  | "social"
  | "floor-plans"
  | "virtual-tour";

type ServiceMedia =
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      objectFit?: "cover" | "contain";
      label: string;
      icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
    }
  | {
      kind: "branded";
      label: string;
      note: string;
      icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
    };

type Service = {
  id: ServiceId;
  title: string;
  summary: string;
  details: readonly string[];
  detailItems?: readonly string[];
  media: ServiceMedia;
};

const MEDIA_BASE = "https://media.openeire.ie/portfolio";

export const REAL_ESTATE_SERVICES: readonly Service[] = [
  {
    id: "photography",
    title: "Property Photography",
    summary:
      "Professionally edited interior and exterior photography focused on layout, presentation and the features buyers need to understand.",
    details: [
      "Interior coverage is composed to show the natural layout and flow of the property. Exterior photography captures the building, entrance, gardens, access and other relevant features.",
      "Every selected image is professionally corrected for exposure, colour, perspective and overall consistency before delivery.",
      "The photographs are supplied at full resolution and prepared for both web and print use.",
    ],
    media: {
      kind: "image",
      src: `${MEDIA_BASE}/county-leitrim-20260803/sitting-room2.webp`,
      alt: "Open living area in a County Leitrim residence photographed by OpenÉire Studios",
      width: 5929,
      height: 3953,
      label: "Genuine OpenÉire property photography",
      icon: FaCamera,
    },
  },
  {
    id: "aerial",
    title: "Aerial Drone Photography",
    summary:
      "Edited aerial stills showing the property, site and wider surroundings where conditions allow.",
    details: [
      "Drone stills show how the property relates to its wider site and surroundings.",
      "The Starter, Pro and Premium packages include 5–8 edited drone stills alongside the indicative interior and exterior photograph range.",
      "All aerial work is subject to suitable weather, site access, airspace restrictions and safe operating conditions.",
    ],
    detailItems: [
      "Detached and rural homes",
      "Properties with significant gardens or land",
      "Waterfront and coastal properties",
      "Farms and agricultural properties",
      "New developments",
      "Properties with separate accommodation or outbuildings",
      "Homes where views and location are important selling points",
    ],
    media: {
      kind: "image",
      src: `${MEDIA_BASE}/county-galway-20260806/front-drone.webp`,
      alt: "Oblique aerial view of a County Galway home, garden, driveway and outbuilding photographed by OpenÉire Studios",
      width: 8064,
      height: 4536,
      label: "Genuine OpenÉire aerial photography",
      icon: FaMapMarkedAlt,
    },
  },
  {
    id: "film",
    title: "Combined 4K Property Film",
    summary:
      "One cinematic property film combining ground and aerial footage, typically 2–3 minutes depending on the property and agreed brief.",
    details: [
      REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE,
      "It is delivered as one final property film, not separate full-length ground and aerial films. The included vertical 9:16 social-media edit remains a separate deliverable.",
    ],
    media: {
      kind: "image",
      src: `${MEDIA_BASE}/county-galway-20260822/front-drone-shot.webp`,
      alt: "Elevated front view from a genuine OpenÉire County Galway property film",
      width: 8064,
      height: 4536,
      label: "Genuine OpenÉire property-film example",
      icon: FaPlay,
    },
  },
  {
    id: "social",
    title: "Vertical Social-Media Video",
    summary:
      "One separate vertical 9:16 edit for platforms such as Instagram Reels, Facebook Reels, TikTok and YouTube Shorts.",
    details: [
      "The Pro and Premium packages include one separate vertical 9:16 social-media edit.",
      "An additional social cut / format is €50 for one defined additional cut or format. Additional revisions, substantially different edits or expanded production are scoped separately.",
    ],
    detailItems: [
      "Instagram Reels",
      "Facebook Reels",
      "TikTok",
      "YouTube Shorts",
    ],
    media: {
      kind: "branded",
      label: "Vertical delivery format",
      note: "One dedicated 9:16 social-media edit",
      icon: FaMobileAlt,
    },
  },
  {
    id: "floor-plans",
    title: "2D Measured Floor Plans",
    summary:
      "Measured floor plans prepared as clear digital marketing assets for listings, websites and brochures.",
    details: [
      "A measured floor plan helps buyers understand the layout and relationship between rooms.",
      "A measured 2D floor plan is included in the Starter, Pro and Premium packages.",
      "Current €75 guidance applies to suitable work that does not already include one.",
    ],
    media: {
      kind: "image",
      src: `${MEDIA_BASE}/floor%20plans/1st_floor_14_d_n_ard_craughwell_with_dim.jpg`,
      alt: "Measured 2D first-floor plan produced for an OpenÉire County Galway property project",
      width: 4000,
      height: 3000,
      objectFit: "contain",
      label: "Genuine OpenÉire measured floor plan",
      icon: FaDraftingCompass,
    },
  },
  {
    id: "virtual-tour",
    title: "Hosted 3D Virtual Tours",
    summary:
      "Hosted interactive tours for suitable properties, allowing prospective buyers to explore the space remotely.",
    details: [
      "A 3D virtual tour allows prospective buyers to explore the property online and move through the rooms at their own pace.",
      "It can provide useful additional context for remote buyers and help interested parties understand the property before attending a viewing.",
      "A hosted 3D virtual tour starts from €150 for a suitable standard-sized property and is included in Premium. Larger, scan-heavy or unusually complex properties are quoted according to size and scope.",
    ],
    media: {
      kind: "branded",
      label: "Hosted interactive tour",
      note: "Suitable-property 3D capture",
      icon: FaCube,
    },
  },
] as const;

const benefits = [
  {
    title: "Stronger listing presentation",
    copy: "Consistent photography and media help the property present clearly across listing platforms and marketing channels.",
  },
  {
    title: "Complete media from one visit",
    copy: "Photography, drone media, floor plans, video and suitable 3D capture can be coordinated through one organised property-media visit.",
  },
  {
    title: "Ready for web, social & print",
    copy: "Final media is prepared for property portals, agency websites, social campaigns, email marketing and printed sales material.",
  },
] as const;

function ServiceMediaPanel({ service }: { service: Service }) {
  const media = service.media;
  const Icon = media.icon ?? FaCamera;

  return (
    <div
      key={service.id}
      className="real-estate-service-media-enter relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-gray-900 shadow-2xl shadow-black/30 motion-reduce:animate-none"
      data-service-media={service.id}
    >
      {media.kind === "image" ? (
        <>
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className={
              media.objectFit === "contain"
                ? "bg-stone-100 object-contain p-4"
                : "object-cover"
            }
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent"
            aria-hidden="true"
          />
          {media.icon ? (
            <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/65 text-accent backdrop-blur">
              <Icon className="h-4 w-4" aria-hidden={true} />
            </span>
          ) : null}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.2),transparent_52%),linear-gradient(145deg,#17202b,#080b10)] px-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/30 bg-accent/10 text-accent shadow-xl shadow-black/20">
            <Icon className="h-9 w-9" aria-hidden={true} />
          </span>
          <p className="mt-6 font-serif text-2xl font-bold text-white">
            {media.label}
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-gray-400">
            {media.note}
          </p>
        </div>
      )}

      {media.kind === "image" ? (
        <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-semibold text-white">
          {media.label}
        </p>
      ) : null}
    </div>
  );
}

export function RealEstateBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealReady, setRevealReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    setRevealReady(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="real-estate-benefits py-16 md:py-20"
      data-reveal-ready={revealReady}
      data-visible={isVisible}
      aria-labelledby="real-estate-benefits-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-4xl">
          <h2
            id="real-estate-benefits-heading"
            className="font-serif text-3xl font-bold md:text-5xl"
          >
            Give Every Property Listing a Stronger First Impression
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Professional property media helps buyers understand the space,
            presentation and setting before arranging a viewing.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="real-estate-benefit-card rounded-3xl border border-white/10 bg-gray-950 p-6 transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-brand-500/50"
              style={{ "--benefit-index": index } as CSSProperties}
            >
              <span
                className="block h-1 w-12 rounded-full bg-linear-to-r from-brand-500 to-accent"
                aria-hidden="true"
              />
              <h3 className="mt-6 font-serif text-2xl font-bold">
                {benefit.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-300">
                {benefit.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RealEstateServicesShowcase() {
  const [activeServiceId, setActiveServiceId] =
    useState<ServiceId>("photography");
  const itemRefs = useRef(new Map<ServiceId, HTMLElement>());
  const activeService =
    REAL_ESTATE_SERVICES.find(({ id }) => id === activeServiceId) ??
    REAL_ESTATE_SERVICES[0];

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(first.boundingClientRect.top - window.innerHeight * 0.4) -
              Math.abs(second.boundingClientRect.top - window.innerHeight * 0.4),
          )[0];

        const serviceId = activeEntry?.target.getAttribute(
          "data-service-item",
        ) as ServiceId | null;
        if (serviceId) setActiveServiceId(serviceId);
      },
      { rootMargin: "-25% 0px -50% 0px", threshold: [0, 0.35, 0.7] },
    );

    itemRefs.current.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="bg-gray-950 py-16 md:py-20"
      aria-labelledby="real-estate-services-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            One coordinated property-media workflow
          </p>
          <h2
            id="real-estate-services-heading"
            className="mt-3 font-serif text-3xl font-bold md:text-5xl"
          >
            Complete Property Media From One Team
          </h2>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-gray-300">
            Instead of coordinating separate photographers, drone operators,
            videographers and floor-plan providers, the agreed listing media can
            be organised through one supplier and one planned property visit
            where conditions allow.
          </p>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:items-start lg:gap-10">
          <div
            className="hidden lg:sticky lg:top-[calc(var(--site-header-height,96px)+var(--real-estate-section-nav-height,64px)+2rem)] lg:block"
            data-service-media-panel="desktop"
          >
            <ServiceMediaPanel service={activeService} />
          </div>

          <div className="space-y-4">
            {REAL_ESTATE_SERVICES.map((service) => {
              const isActive = service.id === activeService.id;
              return (
                <article
                  key={service.id}
                  ref={(element) => {
                    if (element) itemRefs.current.set(service.id, element);
                    else itemRefs.current.delete(service.id);
                  }}
                  data-service-item={service.id}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  onFocus={() => setActiveServiceId(service.id)}
                  className={`rounded-3xl border p-5 transition duration-300 motion-safe:hover:-translate-y-1 sm:p-6 ${
                    isActive
                      ? "border-brand-500/60 bg-brand-500/10 shadow-lg shadow-brand-500/5"
                      : "border-white/10 bg-black/35 hover:border-white/25"
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveServiceId(service.id)}
                    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
                  >
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">
                      {String(
                        REAL_ESTATE_SERVICES.findIndex(
                          ({ id }) => id === service.id,
                        ) + 1,
                      ).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block font-serif text-2xl font-bold text-white">
                      {service.title}
                    </span>
                    <span className="mt-3 block text-sm leading-7 text-gray-300">
                      {service.summary}
                    </span>
                  </button>

                  {isActive ? (
                    <div
                      className="mt-5 lg:hidden"
                      data-service-media-panel="mobile"
                    >
                      <ServiceMediaPanel service={service} />
                    </div>
                  ) : null}

                  <details className="group mt-5 border-t border-white/10 pt-4">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white outline-none transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent">
                      More details about {service.title}
                      <FaChevronDown
                        className="shrink-0 transition group-open:rotate-180 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="space-y-3 pb-1 pt-3 text-sm leading-7 text-gray-300">
                      {service.details.map((detail) => (
                        <p key={detail}>{detail}</p>
                      ))}
                      {service.detailItems ? (
                        <ul className="grid gap-2 pt-1 sm:grid-cols-2">
                          {service.detailItems.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-brand-500" aria-hidden="true">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-sm leading-7 text-gray-300">
            See this workflow in practice across four residential projects,
            including three genuine property films and two measured-floor-plan
            examples.
          </p>
          <Link
            href={REAL_ESTATE_PORTFOLIO_PATH}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Explore the residential portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
