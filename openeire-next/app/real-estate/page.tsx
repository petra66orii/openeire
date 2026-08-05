import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { RealEstateHeroImage } from "@/components/real-estate/RealEstateHeroImage";
import { RealEstateEnquiryForm } from "@/components/real-estate/RealEstateEnquiryForm";
import { DroneQualificationsSection } from "@/components/trust/DroneQualificationsSection";
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
import { REAL_ESTATE_PACKAGES, REAL_ESTATE_VAT_NOTE } from "@/lib/realEstate";
import { REAL_ESTATE_PORTFOLIO_PATH } from "@/lib/realEstatePresentation";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildOpenEireLocalBusinessJsonLd,
} from "@/lib/seo/jsonLd";
import { FaCheckCircle, FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";

export const metadata = buildPageMetadata({
  title: "Property Photography Galway & Connacht | OpenÉire Studios",
  description:
    "Property photography, drone stills, 4K video, floor plans and 3D tours for estate agents, developers and sellers in Galway and across Connacht.",
  path: "/real-estate",
});

const listingUses = [
  "Daft.ie and MyHome.ie",
  "Estate-agency websites",
  "Social-media campaigns",
  "Email marketing",
  "Property brochures",
  "Printed sales materials",
];

const completeMedia = [
  "Professionally edited interior and exterior photography",
  "5–8 aerial drone stills in addition to the ground photographs",
  "A measured 2D floor plan",
  "Interior and exterior property video",
  "A separate 4K aerial drone video",
  "Vertical 9:16 social-media video",
  "A hosted 3D interactive virtual tour",
  "Commercial marketing rights for the active property listing",
];

const droneUses = [
  "Detached and rural homes",
  "Properties with significant gardens or land",
  "Waterfront and coastal properties",
  "Farms and agricultural properties",
  "New developments",
  "Properties with separate accommodation or outbuildings",
  "Homes where views and location are important selling points",
];

const socialPlatforms = [
  "Instagram Reels",
  "Facebook Reels",
  "TikTok",
  "YouTube Shorts",
];

const addOns = [
  {
    title: "Additional Edited Photographs",
    price: "€10 per photograph.",
    body: "Additional images must be agreed as part of the property scope.",
  },
  {
    title: "Measured 2D Floor Plan",
    price: "€75 total.",
    body: "Available for the Essential package and suitable Custom bookings. A measured floor plan is already included in Starter, Pro and Premium.",
  },
  {
    title: "Hosted 3D Virtual Tour",
    price: "€150 total.",
    body: "Included in the Premium package. It may be added to another suitable package where the property and booking scope allow.",
  },
  {
    title: "Same-Day Rush Delivery for Still Photography",
    price: "€75 total.",
    body: "This rush service applies only to still photography. It does not accelerate ground-level video, drone video, vertical social-media video, 3D virtual tours, floor plans or other Premium-package outputs.",
  },
  {
    title: "Extended Drone Video",
    price: "€150 total.",
    body: "Provides an extended aerial video of up to three minutes, fully edited.",
  },
  {
    title: "Additional Social-Media Video",
    price: "€50 total.",
    body: "Available for additional cuts, alternative formats or additional edits beyond the included vertical 9:16 version.",
  },
  {
    title: "Travel Beyond 40 Kilometres",
    price: "€0.50 per kilometre beyond the standard service radius.",
    body: "Travel is calculated from the exact property location and confirmed before the booking is finalised.",
  },
];

const processSteps = [
  {
    title: "1. Send Us the Property Details",
    paragraphs: [
      "Choose your preferred package and provide the property address, property type, approximate scope, preferred date, access information and any features that may affect coverage.",
      "The enquiry form also allows you to describe secondary accommodation, outbuildings, site size and other relevant property features.",
    ],
  },
  {
    title: "2. We Review and Confirm the Shoot",
    paragraphs: [
      "We review the property brief, location, package, access requirements and any relevant airspace considerations.",
      "The shoot date and scope are then confirmed with you, normally within 24 hours. Requested dates are not final until confirmed.",
    ],
  },
  {
    title: "3. We Capture and Edit the Media",
    paragraphs: [
      "Floor-plan scanning, photography, drone media, video and virtual-tour capture are completed according to the selected package and agreed scope.",
      "The property must be cleaned, staged and ready at the agreed arrival time. Significant preparation delays may reduce the available coverage, require rescheduling or result in an agreed additional-time charge.",
    ],
  },
  {
    title: "4. You Receive Listing-Ready Files",
    paragraphs: [
      "The final media is supplied through a secure download link.",
      "The files are prepared for property portals, agency websites, social media, email campaigns and brochures.",
    ],
  },
];

const faqs = [
  {
    question: "How much does property photography cost in Galway?",
    answer:
      "OpenÉire Studios property-photography packages begin at €175 total. The Starter package costs €259 and includes 25 ground photographs, 5–8 aerial drone stills and a measured 2D floor plan. The Pro package costs €419 and includes 30 ground photographs, drone stills, a measured floor plan, ground video, a separate 4K drone video and vertical 9:16 social-media video. The Premium package costs €549 and includes 35 ground photographs, drone stills, a measured floor plan, ground and aerial video, vertical social video and a hosted 3D virtual tour. Travel charges may apply beyond 40 kilometres from our base.",
  },
  {
    question: "Do the prices include VAT?",
    answer: REAL_ESTATE_VAT_NOTE,
  },
  {
    question: "How quickly will I receive the property media?",
    answer:
      "Essential and Starter packages are normally delivered by the end of the next business day. Pro and Premium packages are normally delivered within two business days because of the additional video-production workload. Turnaround begins after the shoot is complete and all required property and client information has been supplied. Weather-dependent return visits and agreed scope changes may affect delivery.",
  },
  {
    question: "Do the photograph numbers include the drone stills?",
    answer:
      "No. The stated photograph numbers for Starter, Pro and Premium refer to professionally edited ground-level interior and exterior photographs. Each of those packages also includes 5–8 aerial drone stills on top of the stated ground-photo count.",
  },
  {
    question: "Which packages include a floor plan?",
    answer:
      "A measured 2D floor plan is included in Starter, Pro and Premium. It can be added to Essential for €75 and may also be included in a suitable Custom quotation.",
  },
  {
    question: "Can the drone be flown at every property?",
    answer:
      "Not necessarily. Drone capture depends on weather, site conditions, airspace restrictions and safe operating limits. These factors are reviewed before the shoot is confirmed.",
  },
  {
    question: "Can you work on active construction sites?",
    answer:
      "OpenÉire holds Safe Pass construction-safety training, supporting work on suitable active construction and development sites. Access remains subject to client permission, site-specific induction and the safety requirements of the principal contractor.",
  },
  {
    question: "What happens when the weather is unsuitable?",
    answer:
      "Where weather or safety conditions fall outside safe operating limits, OpenÉire Studios will offer one reschedule at no additional cost. Further reschedules may incur a fee.",
  },
  {
    question: "Is OpenÉire Studios commercially insured?",
    answer:
      "Yes. OpenÉire Studios is insured for commercial drone operations, with public-liability cover of up to €6.5 million per occurrence.",
  },
  {
    question: "Can the photographs and videos be used on Daft.ie?",
    answer:
      "Yes. Every package includes commercial marketing rights for the specific property listing across property portals, agency websites, social media, email campaigns and printed brochures.",
  },
  {
    question: "Can another estate agent reuse the same media?",
    answer:
      "No. The licence is issued to the booking agent for that particular instruction and is non-transferable. A different agent must arrange a separate shoot or licensing agreement if they subsequently list the property.",
  },
  {
    question: "Do you provide property photography throughout Galway?",
    answer:
      "Yes. Galway is OpenÉire Studios’ primary service county. We also cover suitable property shoots across Mayo, Roscommon, Sligo and Leitrim. Travel beyond 40 kilometres from our base is charged at €0.50 per kilometre.",
  },
  {
    question: "Can several properties be photographed on the same day?",
    answer:
      "Yes. Multi-property shoot days are available through a Custom quotation. Send the property locations and required services so that the route, scope and price can be assessed together.",
  },
  {
    question: "Is drone photography included in every package?",
    answer:
      "Drone stills are included with Starter, Pro and Premium. Essential includes ground-level interior and exterior photography only.",
  },
  {
    question: "Are vertical social-media videos included?",
    answer:
      "A vertical 9:16 social-media video is included with Pro and Premium. Additional cuts, alternative formats or extra edits may be arranged for €50.",
  },
  {
    question: "Is a 3D virtual tour included?",
    answer:
      "A hosted, shareable 3D virtual tour is included with Premium. It can be added to another suitable package for €150 where the property and booking scope allow.",
  },
];

const realEstatePackageOffers = REAL_ESTATE_PACKAGES.map((packageItem) => ({
  name: `${packageItem.name} real estate media package`,
  description: `${packageItem.price}. Includes ${packageItem.text}`,
  ...(packageItem.priceAmount !== null
    ? { price: String(packageItem.priceAmount) }
    : {}),
}));

const schema = [
  buildBreadcrumbJsonLd([
    { name: "Home", url: buildAbsoluteUrl("/") },
    { name: "Real Estate Media", url: buildAbsoluteUrl("/real-estate") },
  ]),
  buildFaqPageJsonLd(faqs),
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
    name: `${SITE_NAME} Property Photography and Drone Media`,
    url: buildAbsoluteUrl("/real-estate"),
    description:
      "Property photography, drone stills, 4K video, floor plans and 3D tours for estate agents, developers and sellers in Galway and across Connacht.",
    serviceType: [
      "Property photography",
      "Real estate drone photography",
      "Property videography",
      "Measured 2D floor plans",
      "3D virtual tours",
    ],
    areaServed: ["County Galway", "County Mayo", "County Roscommon", "County Sligo", "County Leitrim"],
    provider: {
      "@id": `${buildAbsoluteUrl("/").replace(/\/+$/, "")}/#localbusiness`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Property photography packages",
      itemListElement: realEstatePackageOffers.map((offer, index) => ({
        "@type": "Offer",
        position: index + 1,
        name: offer.name,
        description: offer.description,
        url: buildAbsoluteUrl("/real-estate#packages"),
        availability: "https://schema.org/InStock",
        ...("price" in offer && offer.price
          ? { price: offer.price, priceCurrency: "EUR" }
          : {}),
      })),
    },
  },
];

const listClass = "mt-5 space-y-2 text-gray-300";
const proseClass = "mt-4 leading-relaxed text-gray-300";

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className={listClass}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <FaCheckCircle className="mt-1 shrink-0 text-brand-500" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

type PackageCardItem = (typeof REAL_ESTATE_PACKAGES)[number];

function PackageCard({
  item,
  secondary = false,
}: {
  item: PackageCardItem;
  secondary?: boolean;
}) {
  const featured = "badge" in item;
  return (
    <article
      className={`relative flex h-full flex-col rounded-[1.75rem] border p-6 ${
        featured
          ? "border-brand-500 bg-brand-500/10 shadow-2xl shadow-brand-500/10"
          : "border-white/10 bg-black"
      } ${secondary ? "lg:grid lg:grid-cols-[0.75fr_1.5fr_auto] lg:items-center lg:gap-8" : ""}`}
    >
      <div>
        {featured ? (
          <span className="mb-4 inline-flex w-fit rounded-full bg-brand-500 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
            Recommended
          </span>
        ) : null}
        <h3 className="font-serif text-2xl font-bold">
          {item.name} — {item.price === "POA" ? "Price on Application" : `${item.price.replace(" total", "")} Total`}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.description}</p>
      </div>
      <div className={secondary ? "mt-5 lg:mt-0" : "flex-1"}>
        <CheckList items={item.features} />
      </div>
      <a
        href={`/real-estate?package=${item.id}#enquiry`}
        className={`${secondary ? "mt-6 lg:mt-0 lg:min-w-48" : "mt-8"} rounded-full border border-white/20 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] transition hover:border-brand-500 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-black`}
      >
        {item.id === "custom" ? "Request a Custom Quote" : `Enquire About ${item.name}`}
      </a>
    </article>
  );
}

export default function RealEstatePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <JsonLd data={schema} />

      <section className="relative isolate overflow-hidden pt-[calc(var(--site-header-height,96px)+2rem)]">
        <RealEstateHeroImage objectPositionClassName="object-[64%_center] sm:object-[68%_center] lg:object-[72%_center]" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/95 via-black/75 to-black/40" aria-hidden="true" />
        <div className="container mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-20 lg:px-8">
          <div className="max-w-4xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-accent">
              <FaMapMarkerAlt aria-hidden="true" /> Based in County Galway
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Property Photography and Drone Media in Galway and Across Connacht
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-gray-200">
              Complete property photography, aerial drone media, video tours, floor plans and 3D virtual tours for estate agents, developers and private sellers.
            </p>
            <p className={proseClass}>
              Based in County Galway, OpenÉire Studios provides listing-ready property media throughout Galway and across Connacht.
            </p>
            <p className={proseClass}>
              One carefully planned visit gives you professionally edited ground photography and, depending on your package, aerial drone stills, ground-level video, 4K drone video, vertical social-media content, a measured floor plan and an interactive 3D tour.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#enquiry" className="rounded-full bg-brand-500 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] transition hover:bg-brand-600">Request a Property Shoot</a>
              <Link href={REAL_ESTATE_PORTFOLIO_PATH} className="rounded-full border border-white/30 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] transition hover:border-accent hover:text-accent">View Our Property Portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Property media service assurances" className="border-y border-white/10 bg-gray-950">
        <div className="container mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {["Property photography packages from €175 total", "Commercial marketing licence included", "Clear business-day turnaround", "Drone capture subject to weather, airspace and safe operating conditions"].map((item) => (
            <p key={item} className="flex gap-3 text-sm text-gray-300"><FaCheckCircle className="mt-1 shrink-0 text-brand-500" aria-hidden="true" />{item}</p>
          ))}
        </div>
      </section>

      <main>
        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Give Every Property Listing a Stronger First Impression</h2>
            <p className={proseClass}>Professional property media helps prospective buyers understand the space, presentation and setting of a property before arranging a viewing.</p>
            <p className={proseClass}>We capture interiors, exteriors and important selling points with a consistent visual approach. For properties where the site or surroundings matter, aerial drone photography and video provide the wider context that ground-level images cannot show alone.</p>
            <p className={proseClass}>Your finished media is prepared for use across:</p>
            <CheckList items={listingUses} />
          </div>
        </section>

        <section className="bg-gray-950 py-20">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Complete Property Media From One Team</h2>
            <p className={proseClass}>Instead of coordinating separate photographers, drone operators and floor-plan providers, you can arrange the complete media package through one booking.</p>
            <p className={proseClass}>Depending on the selected package, your property shoot may include:</p>
            <CheckList items={completeMedia} />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:px-8">
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Property Photography</h2>
              <p className={proseClass}>We photograph the rooms, exterior areas and features buyers need to understand.</p>
              <p className={proseClass}>Interior coverage is composed to show the natural layout and flow of the property. Exterior photography captures the building, entrance, gardens, access and other relevant features.</p>
              <p className={proseClass}>Every selected image is professionally corrected for exposure, colour, perspective and overall consistency before delivery.</p>
              <p className={proseClass}>The photographs are supplied at full resolution and prepared for both web and print use.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Aerial Drone Photography</h2>
              <p className={proseClass}>Drone stills show how the property relates to its wider site and surroundings.</p>
              <p className={proseClass}>They are especially useful for:</p>
              <CheckList items={droneUses} />
              <p className={proseClass}>The Starter, Pro and Premium packages include <strong>5–8 aerial drone stills on top of the stated number of ground photographs</strong>.</p>
              <p className={proseClass}>All aerial work is subject to suitable weather, site access, airspace restrictions and safe operating conditions.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Property Video and 4K Drone Video</h2>
              <p className={proseClass}>The Pro and Premium packages include both ground-level property video and a separate aerial drone video.</p>
              <p className={proseClass}>The ground video provides a polished visual tour of the interior and exterior of the property. The aerial video presents the building, land and surroundings from above.</p>
              <p className={proseClass}>Each video is normally 60–90 seconds long and is fully edited with music.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Vertical Social-Media Video</h2>
              <p className={proseClass}>The Pro and Premium packages include a vertical 9:16 social-media video prepared for platforms such as:</p>
              <CheckList items={socialPlatforms} />
              <p className={proseClass}>Additional social-media cuts, alternative formats or extra edits may be arranged for €50.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">2D Measured Floor Plans</h2>
              <p className={proseClass}>A measured floor plan helps buyers understand the layout and relationship between rooms.</p>
              <p className={proseClass}>The floor plan is intended for property-marketing purposes and is supplied as a clear digital asset for listings, websites and brochures.</p>
              <p className={proseClass}>A measured 2D floor plan is included in the Starter, Pro and Premium packages.</p>
              <p className={proseClass}>It remains available as a €75 add-on for the Essential package and suitable Custom bookings.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Hosted 3D Virtual Tours</h2>
              <p className={proseClass}>A 3D virtual tour allows prospective buyers to explore the property online and move through the rooms at their own pace.</p>
              <p className={proseClass}>It can provide useful additional context for remote buyers and help interested parties understand the property before attending a viewing.</p>
              <p className={proseClass}>A hosted 3D virtual tour costs €150 as an add-on and is included in the Premium package.</p>
            </article>
          </div>
        </section>

        <section id="packages" className="scroll-mt-32 bg-gray-950 py-20">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Property Photography Packages</h2>
            <p className={proseClass}>{REAL_ESTATE_VAT_NOTE}</p>
            <p className={proseClass}>Standard package pricing applies within 40 kilometres of our base. A travel supplement applies beyond that distance.</p>
            <p className={proseClass}>Turnaround begins once the shoot has been completed and all required property and client information has been supplied. Weather-dependent return visits and agreed changes to the scope may affect delivery.</p>
            <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
              {REAL_ESTATE_PACKAGES.slice(0, 4).map((item) => (
                <PackageCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-5">
              <PackageCard item={REAL_ESTATE_PACKAGES[4]} secondary />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Optional Property-Media Add-Ons</h2>
            <p className={proseClass}>Add only the services the individual listing needs.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {addOns.map((item) => (
                <article key={item.title} className="rounded-3xl border border-white/10 bg-gray-950 p-6">
                  <h3 className="font-serif text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 font-bold text-accent">{item.price}</p>
                  <p className={proseClass}>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-950 py-20">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">How the Property-Shoot Process Works</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <article key={step.title} className="rounded-3xl border border-white/10 bg-black p-6">
                  <h3 className="font-serif text-2xl font-bold">{step.title}</h3>
                  {step.paragraphs.map((paragraph) => <p key={paragraph} className={proseClass}>{paragraph}</p>)}
                </article>
              ))}
            </div>
          </div>
        </section>

        <DroneQualificationsSection variant="full" />

        <section className="py-20">
          <div className="container mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:px-8">
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Weather and Drone Operations</h2>
              <p className={proseClass}>Aerial work is planned around weather conditions, airspace restrictions, site conditions, safe operating limits and suitable property access.</p>
              <p className={proseClass}>Where weather or safety conditions prevent drone operations, OpenÉire Studios will offer one reschedule at no additional cost.</p>
              <p className={proseClass}>Further reschedules may incur a fee.</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-gray-950 p-7">
              <h2 className="font-serif text-3xl font-bold">Property Photography in Galway and Across Connacht</h2>
              <p className={proseClass}>County Galway is our primary service area.</p>
              <p className={proseClass}>We provide property photography and drone media for suitable listings throughout Galway, including Galway City and towns and rural areas across the county.</p>
              <p className={proseClass}>We also travel throughout Connacht, including County Mayo, County Roscommon, County Sligo and County Leitrim.</p>
              <p className={proseClass}>Standard package pricing applies within 40 kilometres of our base. A travel supplement of €0.50 per kilometre applies beyond that radius.</p>
              <p className={proseClass}>For multiple properties or geographically grouped shoots, request a Custom quotation.</p>
            </article>
          </div>
        </section>

        <section className="bg-gray-950 py-20">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Commercial Marketing Licence</h2>
            <p className={proseClass}>Every package includes a commercial marketing licence for the specific property listing.</p>
            <p className={proseClass}>The licence permits the booking agent or client to use the delivered media across property portals, the agency website, social media, email campaigns and printed brochures.</p>
            <p className={proseClass}>The licence is non-transferable.</p>
            <p className={proseClass}>It ends when the property is sold, let or withdrawn from the market, or after two years—whichever happens first.</p>
            <p className={proseClass}>The licence belongs to the booking agent for that specific instruction. Another agent cannot reuse the media if they subsequently take over the listing without arranging a separate shoot or licensing agreement with OpenÉire Studios.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Property Media Frequently Asked Questions</h2>
            <div className="mt-10 space-y-4">
              {faqs.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-gray-950 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{item.question}<FaChevronDown className="shrink-0 text-brand-500 transition group-open:rotate-180" aria-hidden="true" /></summary>
                  <p className={proseClass}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-950 py-20 text-center">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-3xl font-bold md:text-5xl">Ready to Market the Property?</h2>
            <p className={proseClass}>Tell us about the property, its location and the media you need.</p>
            <p className={proseClass}>We will review the scope, access, package, travel requirements and drone-operating conditions before confirming the booking.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#enquiry" className="rounded-full bg-brand-500 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em]">Request a Property Shoot</a>
              <Link href="/contact" className="rounded-full border border-white/30 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] transition hover:border-accent hover:text-accent">Contact OpenÉire Studios</Link>
            </div>
            <p className="mt-6 text-sm text-gray-400">Based in County Galway and covering suitable property listings throughout Connacht.</p>
          </div>
        </section>
      </main>

      <RealEstateEnquiryForm />
    </div>
  );
}
