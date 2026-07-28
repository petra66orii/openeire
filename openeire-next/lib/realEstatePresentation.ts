export const REAL_ESTATE_PORTFOLIO_PATH = "/real-estate/portfolio";

export const REAL_ESTATE_HERO_IMAGE = {
  src: "https://media.openeire.ie/portfolio/county-galway-20260724/drone-exterior-v1.webp",
  alt: "Aerial view of a residential property photographed by OpenÉire Studios",
  width: 2500,
  height: 1406,
} as const;

export const REAL_ESTATE_PORTFOLIO_HERO_IMAGE = {
  src: "https://media.openeire.ie/portfolio/county-galway-20260724/hero-v1.webp",
  alt: "Exterior view of a residential property photographed by OpenÉire Studios",
  width: 2500,
  height: 1406,
} as const;

export type RealEstateHeroImageConfig =
  | typeof REAL_ESTATE_HERO_IMAGE
  | typeof REAL_ESTATE_PORTFOLIO_HERO_IMAGE;

export const PORTFOLIO_FORMAT_DEFINITIONS = {
  photography: {
    title: "Interior and exterior photography",
    text: "A considered sequence of rooms, details, exterior elevations and setting.",
  },
  aerialStills: {
    title: "Aerial drone stills",
    text: "Elevated context for the property, grounds and wider setting.",
  },
  groundVideo: {
    title: "Ground property video",
    text: "A natural visual walkthrough shaped around the property and listing brief.",
  },
  aerialVideo: {
    title: "Aerial video",
    text: "Controlled aerial movement that helps establish scale and setting.",
  },
  socialMediaCuts: {
    title: "Social-media cuts",
    text: "Purpose-made vertical and square edits for listing channels.",
  },
  floorPlan: {
    title: "Measured 2D floor plans",
    text: "Clear layout information supplied as an optional listing asset.",
  },
} as const;

export type PortfolioFormat =
  keyof typeof PORTFOLIO_FORMAT_DEFINITIONS;

export const PORTFOLIO_FORMAT_ORDER: readonly PortfolioFormat[] = [
  "photography",
  "aerialStills",
  "groundVideo",
  "aerialVideo",
  "socialMediaCuts",
  "floorPlan",
];
