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
      "10 professionally edited interior and exterior ground photographs",
    description:
      "Best for smaller properties, rentals and straightforward starter listings.",
    features: [
      "10 edited interior and exterior photographs",
      "Full-resolution delivery",
      "Next-business-day delivery",
      "Commercial marketing licence",
      "Optional 2D floor plan +€75",
    ],
    text: `10 professionally edited interior and exterior ground photographs, full-resolution delivery, ${REAL_ESTATE_TURNAROUNDS.essential.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.essential,
  },
  {
    id: "starter",
    name: "Starter",
    price: "\u20AC259 total",
    priceAmount: 259,
    includedPhotographs: 25,
    includedPhotographsLabel:
      "25 professionally edited interior and exterior ground photographs",
    description: "Best for standard residential listings without video.",
    features: [
      "25 edited ground photographs",
      "5–8 drone stills",
      "2D measured floor plan",
      "Full-resolution delivery",
      "Next-business-day delivery",
      "Commercial marketing licence",
    ],
    text: `25 professionally edited interior and exterior ground photographs, 5-8 aerial drone stills in addition to the ground photographs, measured 2D floor plan, full-resolution delivery, ${REAL_ESTATE_TURNAROUNDS.starter.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.starter,
  },
  {
    id: "pro",
    name: "Pro",
    price: "\u20AC419 total",
    priceAmount: 419,
    includedPhotographs: 30,
    includedPhotographsLabel:
      "30 professionally edited interior and exterior ground photographs",
    badge: "Recommended",
    description:
      "Best for detached homes, larger listings and standout marketing.",
    features: [
      "30 edited ground photographs",
      "5–8 drone stills",
      "2D measured floor plan",
      "60–90 sec ground video",
      "Separate 4K drone video",
      "Vertical 9:16 social video",
      "Full-resolution delivery",
      "Two-business-day delivery",
    ],
    text: `30 professionally edited interior and exterior ground photographs, 5-8 aerial drone stills in addition to the ground photographs, measured 2D floor plan, 60-90 second ground video, a separate 60-90 second 4K aerial drone video, one vertical 9:16 social-media video, ${REAL_ESTATE_TURNAROUNDS.pro.label.toLowerCase()}, and listing marketing licence.`,
    turnaround: REAL_ESTATE_TURNAROUNDS.pro,
  },
  {
    id: "premium",
    name: "Premium",
    price: "\u20AC549 total",
    priceAmount: 549,
    includedPhotographs: 35,
    includedPhotographsLabel:
      "35 professionally edited interior and exterior ground photographs",
    description:
      "Best for premium, rural, waterfront and high-impact listings.",
    features: [
      "35 edited ground photographs",
      "5–8 drone stills",
      "2D measured floor plan",
      "60–90 sec ground video",
      "Separate 4K drone video",
      "Vertical 9:16 social video",
      "Hosted 3D virtual tour",
      "Two-business-day delivery",
    ],
    text: `35 professionally edited interior and exterior ground photographs, 5-8 aerial drone stills in addition to the ground photographs, measured 2D floor plan, ground video, a separate 4K aerial drone video, one vertical 9:16 social-media video, hosted 3D virtual tour, ${REAL_ESTATE_TURNAROUNDS.premium.label.toLowerCase()}, and listing marketing licence.`,
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
      "Best for multi-property, commercial, agricultural and bespoke shoots. Suitable for developments, active construction sites and multi-property projects, subject to site access and safety requirements.",
    features: [
      "Scope agreed per project",
      "Multi-property bookings",
      "Drone photography and video",
      "Measured floor plans",
      "Developer packages",
      "Agreed turnaround",
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
