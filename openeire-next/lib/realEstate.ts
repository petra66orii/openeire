export const REAL_ESTATE_VAT_NOTE =
  "OpenÉire Studios is not currently VAT registered. No VAT is charged.";

export type RealEstatePackageId =
  | "essential"
  | "starter"
  | "pro"
  | "premium"
  | "custom"
  | "not_sure";

export const REAL_ESTATE_TURNAROUNDS = {
  essential: {
    code: "next_business_day",
    label: "Next-business-day delivery",
    detail:
      "This package is normally delivered by the end of the next business day.",
  },
  starter: {
    code: "next_business_day",
    label: "Next-business-day delivery",
    detail:
      "This package is normally delivered by the end of the next business day.",
  },
  pro: {
    code: "two_business_days",
    label: "Delivery within 2 business days",
    detail:
      "This package is normally delivered within two business days due to the additional video-production workload.",
  },
  premium: {
    code: "two_business_days",
    label: "Delivery within 2 business days",
    detail:
      "This package is normally delivered within two business days due to the additional video-production workload.",
  },
  custom: {
    code: "specifically_agreed",
    label: "Turnaround as specifically agreed",
    detail: "Turnaround will be set out in the specifically agreed quotation.",
  },
  not_sure: {
    code: "specifically_agreed",
    label: "Turnaround as specifically agreed",
    detail: "Turnaround will be set out in the specifically agreed quotation.",
  },
} as const satisfies Record<
  RealEstatePackageId,
  { code: string; label: string; detail: string }
>;

export const REAL_ESTATE_STANDARD_TURNAROUND_COPY =
  "Essential and Starter packages are normally delivered by the end of the next business day. Pro and Premium packages are normally delivered within two business days due to the additional video-production workload.";

export const REAL_ESTATE_TURNAROUND_CONTEXT =
  "Turnaround begins once the shoot is complete and all required property and client information has been supplied. Weather-dependent return visits and agreed changes to the scope may affect delivery.";

export const REAL_ESTATE_RUSH_DELIVERY_LABEL =
  "Rush same-day delivery — still photography only";

export const REAL_ESTATE_RUSH_DELIVERY_NOTE =
  "The €75 rush add-on covers still photography only. It does not rush drone video, ground video, social-media video cuts, 3D virtual tours, floor plans or other Premium outputs.";

export const getRealEstateTurnaround = (packageId: RealEstatePackageId) =>
  REAL_ESTATE_TURNAROUNDS[packageId];

export const REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_PRICE = 10;
export const REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY =
  "Additional edited photographs may be agreed at €10 per photograph.";

export const REAL_ESTATE_PACKAGES = [
  {
    id: "essential",
    name: "Essential",
    price: "\u20AC175 total",
    priceAmount: 175,
    includedPhotographs: 10,
    includedPhotographsLabel:
      "10 professionally edited interior and exterior photographs",
    description: "Recommended for smaller properties, rentals, starter listings.",
    features: [
      "10 professionally edited interior & exterior photographs",
      "Full resolution delivery, print & web ready",
      REAL_ESTATE_TURNAROUNDS.essential.label,
      "Commercial marketing licence for this specific property listing, including Daft.ie, MyHome.ie, agency websites, social media, email campaigns and print brochures, for the duration of the active listing (up to 2 years, non-transferable).",
    ],
    text: `10 professionally edited interior and exterior photographs, full-resolution delivery, ${REAL_ESTATE_TURNAROUNDS.essential.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.essential,
  },
  {
    id: "starter",
    name: "Starter",
    price: "\u20AC229 total",
    priceAmount: 229,
    includedPhotographs: 25,
    includedPhotographsLabel:
      "25 professionally edited interior and exterior photographs",
    description: "Recommended for standard 3-4 bed residential properties.",
    features: [
      "25 professionally edited interior & exterior photographs",
      "5-8 high-quality aerial drone stills",
      "Full resolution delivery, print & web ready",
      REAL_ESTATE_TURNAROUNDS.starter.label,
      "Commercial marketing licence",
    ],
    text: `25 professionally edited interior and exterior photographs, 5-8 aerial drone photographs, full-resolution delivery, ${REAL_ESTATE_TURNAROUNDS.starter.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.starter,
  },
  {
    id: "pro",
    name: "Pro",
    price: "\u20AC399 total",
    priceAmount: 399,
    includedPhotographs: 30,
    includedPhotographsLabel:
      "30 professionally edited interior and exterior photographs",
    badge: "Recommended",
    description:
      "Recommended for detached homes, larger properties, new builds, agents wanting standout listings.",
    features: [
      "30 professionally edited interior & exterior photographs",
      "5-8 high-quality aerial drone stills",
      "60-90 seconds of interior & exterior video, fully edited with music",
      "Aerial drone video, 60-90 seconds, 4K, edited with music",
      "Social media cuts included, portrait 9:16 and square 1:1 formatted reels",
      "Full resolution delivery, print & web ready",
      REAL_ESTATE_TURNAROUNDS.pro.label,
      "Commercial marketing licence",
    ],
    text: `30 professionally edited interior and exterior photographs, 5-8 aerial drone photographs, 60-90 second ground video, 60-90 second 4K aerial drone video, portrait and square social-media cuts, ${REAL_ESTATE_TURNAROUNDS.pro.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.pro,
  },
  {
    id: "premium",
    name: "Premium",
    price: "\u20AC579 total",
    priceAmount: 579,
    includedPhotographs: 35,
    includedPhotographsLabel:
      "35 professionally edited interior and exterior photographs",
    description:
      "Recommended for premium listings, larger homes, waterfront/rural properties, new developments, and properties where presentation is a major selling point.",
    features: [
      "35 professionally edited interior & exterior photographs",
      "5-8 high-quality aerial drone stills",
      "60-90 seconds of interior & exterior video, fully edited with music",
      "Aerial drone video, 60-90 seconds, 4K, edited with music",
      "Social media cuts included, portrait 9:16 and square 1:1 formatted reels",
      "3D interactive virtual tour, hosted, shareable link",
      "Floor plan, 2D measured",
      "Full resolution delivery, print & web ready",
      REAL_ESTATE_TURNAROUNDS.premium.label,
      "Commercial marketing licence",
    ],
    text: `35 professionally edited interior and exterior photographs, 5-8 aerial drone photographs, ground video, aerial drone video, standard social-media cuts, hosted 3D virtual tour, 2D measured floor plan, ${REAL_ESTATE_TURNAROUNDS.premium.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.premium,
  },
  {
    id: "custom",
    name: "Custom",
    price: "POA",
    priceAmount: null,
    includedPhotographs: null,
    includedPhotographsLabel: "Included photographs as specifically agreed",
    description:
      "For multi-property shoots, large developments, commercial properties, agricultural properties and bespoke bundles. Suitable for developments, active construction sites and multi-property projects, subject to site access and safety requirements.",
    features: [
      "Included photographs as specifically agreed",
      "Multiple properties in a single booking",
      "Cinematic property films",
      "Commercial or agricultural properties",
      "Developer packages",
      REAL_ESTATE_TURNAROUNDS.custom.label,
    ],
    text: `For multi-property shoots, large developments, commercial properties, agricultural properties, and bespoke bundles. ${REAL_ESTATE_TURNAROUNDS.custom.label}.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.custom,
  },
] as const;

export const REAL_ESTATE_ENQUIRY_PACKAGES = [
  ...REAL_ESTATE_PACKAGES,
  {
    id: "not_sure",
    name: "Not sure",
    price: "Specifically agreed",
    priceAmount: null,
    includedPhotographs: null,
    includedPhotographsLabel: "Included photographs as specifically agreed",
    turnaround: REAL_ESTATE_TURNAROUNDS.not_sure,
  },
] as const;

export const getRealEstatePackage = (packageId: RealEstatePackageId) =>
  REAL_ESTATE_ENQUIRY_PACKAGES.find(({ id }) => id === packageId);
