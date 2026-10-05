export const REAL_ESTATE_VAT_NOTE =
  "OpenÉire Studios is not currently VAT registered. No VAT is charged.";

export type RealEstatePackageId =
  | "starter"
  | "pro"
  | "premium"
  | "custom"
  | "not_sure";

export const REAL_ESTATE_TURNAROUNDS = {
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
  "Starter is normally delivered by the end of the next business day. Pro and Premium are normally delivered within two business days due to the additional video-production workload.";

export const REAL_ESTATE_TURNAROUND_CONTEXT =
  "Turnaround begins once the shoot is complete and all required property and client information has been supplied. Weather-dependent return visits and agreed changes to the scope may affect delivery.";

export const REAL_ESTATE_RUSH_DELIVERY_LABEL =
  "Rush same-day delivery — still photography only";

export const REAL_ESTATE_RUSH_DELIVERY_NOTE =
  "The €75 rush add-on covers still photography only. It does not rush property films, social-media video cuts, 3D virtual tours, floor plans or other Premium outputs.";

export const getRealEstateTurnaround = (packageId: RealEstatePackageId) =>
  REAL_ESTATE_TURNAROUNDS[packageId];

export const REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_PRICE = 10;
export const REAL_ESTATE_ADDITIONAL_PHOTOGRAPH_COPY =
  "Additional edited photographs — €10 each";
export const REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE =
  "One combined cinematic 4K property film using ground and aerial footage";
export const REAL_ESTATE_COMBINED_VIDEO_RUNTIME =
  "Approx. 2–3 minutes where the property and agreed brief justify it";
export const REAL_ESTATE_GALLERY_QUALIFIER =
  "Photo quantities are indicative rather than a fixed minimum. The final gallery depends on the property’s size, layout, presentation, access and agreed brief, with priority given to a strong, non-repetitive set of marketing images.";
export const REAL_ESTATE_STARTING_PRICE_COPY =
  "Property-media packages from €259 total.";
export const REAL_ESTATE_CATALOGUE_VERSION = "residential_2026_10";

export const REAL_ESTATE_PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "\u20AC259 total",
    priceAmount: 259,
    includedPhotographs: 25,
    includedPhotographsMax: 30,
    includedPhotographsLabel:
      "Typically 25–30 professionally edited interior and exterior photographs",
    description:
      "Best for standard residential listings that need professional photography, aerial coverage and a measured floor plan.",
    features: [
      "Typically 25–30 professionally edited interior and exterior photographs",
      "5–8 edited drone stills",
      "Measured 2D floor plan",
      "Full-resolution delivery",
      "Next-business-day delivery",
      "Commercial marketing licence",
    ],
    text: `Typically 25–30 professionally edited interior and exterior photographs, 5–8 edited drone stills, measured 2D floor plan, full-resolution delivery, ${REAL_ESTATE_TURNAROUNDS.starter.label.toLowerCase()}, and commercial marketing licence.`,
    galleryQualifier: REAL_ESTATE_GALLERY_QUALIFIER,
    turnaround: REAL_ESTATE_TURNAROUNDS.starter,
  },
  {
    id: "pro",
    name: "Pro",
    price: "\u20AC419 total",
    priceAmount: 419,
    includedPhotographs: 30,
    includedPhotographsMax: 35,
    includedPhotographsLabel:
      "Typically 30–35 professionally edited interior and exterior photographs",
    badge: "Recommended",
    description:
      "For listings that benefit from a complete photography and video package.",
    features: [
      "Typically 30–35 professionally edited interior and exterior photographs",
      "5–8 edited drone stills",
      "Measured 2D floor plan",
      REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE,
      REAL_ESTATE_COMBINED_VIDEO_RUNTIME,
      "One separate vertical 9:16 social-media edit",
      "Full-resolution delivery",
      "Two-business-day delivery",
      "Commercial marketing licence",
    ],
    text: `Typically 30–35 professionally edited interior and exterior photographs, 5–8 edited drone stills, measured 2D floor plan, ${REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE}, approximately 2–3 minutes where the property and agreed brief justify it, one separate vertical 9:16 social-media edit, ${REAL_ESTATE_TURNAROUNDS.pro.label.toLowerCase()}, and commercial marketing licence.`,
    galleryQualifier: REAL_ESTATE_GALLERY_QUALIFIER,
    turnaround: REAL_ESTATE_TURNAROUNDS.pro,
  },
  {
    id: "premium",
    name: "Premium",
    price: "\u20AC549 total",
    priceAmount: 549,
    includedPhotographs: 35,
    includedPhotographsMax: 40,
    includedPhotographsLabel:
      "Typically 35–40 professionally edited interior and exterior photographs",
    description:
      "For listings that need the fullest standard residential media package.",
    features: [
      "Typically 35–40 professionally edited interior and exterior photographs",
      "5–8 edited drone stills",
      "Measured 2D floor plan",
      REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE,
      REAL_ESTATE_COMBINED_VIDEO_RUNTIME,
      "One separate vertical 9:16 social-media edit",
      "Hosted 3D virtual tour for a suitable standard-sized property",
      "Full-resolution delivery",
      "Two-business-day delivery",
      "Commercial marketing licence",
    ],
    text: `Typically 35–40 professionally edited interior and exterior photographs, 5–8 edited drone stills, measured 2D floor plan, ${REAL_ESTATE_COMBINED_VIDEO_DELIVERABLE}, approximately 2–3 minutes where the property and agreed brief justify it, one separate vertical 9:16 social-media edit, hosted 3D virtual tour for a suitable standard-sized property, full-resolution delivery, ${REAL_ESTATE_TURNAROUNDS.premium.label.toLowerCase()}, and commercial marketing licence.`,
    galleryQualifier: REAL_ESTATE_GALLERY_QUALIFIER,
    virtualTourQualifier:
      "The included 3D tour applies to a suitable standard-sized property. Larger, scan-heavy or unusually complex properties require a scope review and may be quoted separately.",
    turnaround: REAL_ESTATE_TURNAROUNDS.premium,
  },
  {
    id: "custom",
    name: "Custom / POA",
    price: "Custom / POA",
    priceAmount: null,
    includedPhotographs: null,
    includedPhotographsLabel: "Included photographs as specifically agreed",
    description:
      "Recommended for substantial grounds, multiple buildings or accommodation units, land-heavy coverage, unusually large properties, extensive twilight requirements, presenter-led production, bespoke film requirements or luxury/architectural work materially beyond the standard residential packages.",
    features: [
      "Scope and price reviewed before booking",
      "Deliverables agreed per project",
      "Turnaround as specifically agreed",
    ],
    text: `Recommended for substantial grounds, multiple buildings or accommodation units, land-heavy coverage, unusually large properties, extensive twilight requirements, presenter-led production, bespoke film requirements or luxury/architectural work materially beyond the standard residential packages. ${REAL_ESTATE_TURNAROUNDS.custom.label}.`,
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
