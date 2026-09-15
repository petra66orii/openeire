import {
  PORTFOLIO_FORMAT_ORDER,
  type PortfolioFormat,
} from "@/lib/realEstatePresentation";

export type PortfolioImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type PortfolioVideo = {
  youtubeVideoId: string;
  poster: PortfolioImage;
  title: string;
  description: string;
  width: number;
  height: number;
};

export type RealEstatePortfolioProject = {
  slug: string;
  anchorId: string;
  title: string;
  generalLocation: string;
  propertyType: string;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: readonly string[];
  packageName: string;
  imageCount: number;
  heroImage?: PortfolioImage;
  galleryImages: readonly PortfolioImage[];
  photographyFormats: readonly Extract<
    PortfolioFormat,
    "photography" | "aerialStills"
  >[];
  groundVideo?: PortfolioVideo;
  aerialVideo?: PortfolioVideo;
  propertyFilm?: PortfolioVideo;
  socialVideos?: readonly PortfolioVideo[];
  floorPlanImages?: readonly PortfolioImage[];
  featured: boolean;
  published: boolean;
  portfolioPermissionConfirmed: boolean;
  permissionReference?: string;
  completedDate?: string;
  clientCredit?: string;
};

/**
 * This catalogue is intentionally safe to ship with no public entries.
 *
 * Add project content only after following docs/real-estate-portfolio.md.
 * Never use a booking reference, address, Eircode, client communication, or
 * other private identifier as permissionReference.
 */
const COUNTY_GALWAY_PROJECT_MEDIA =
  "https://media.openeire.ie/portfolio/county-galway-20260724";
const KILLASCAUL_PROJECT_MEDIA =
  "https://media.openeire.ie/portfolio/county-galway-20260806";
const CRAUGHWELL_PROJECT_MEDIA =
  "https://media.openeire.ie/portfolio/county-galway-20260822";
const LOUGH_RYNN_PROJECT_MEDIA =
  "https://media.openeire.ie/portfolio/county-leitrim-20260803";
const FLOOR_PLAN_MEDIA = "https://media.openeire.ie/portfolio/floor%20plans";

export const REAL_ESTATE_PORTFOLIO_PROJECTS: readonly RealEstatePortfolioProject[] =
  [
    {
      slug: "detached-residence-county-galway",
      anchorId: "county-galway-country-residence",
      title: "Detached country residence in County Galway",
      generalLocation: "County Galway",
      propertyType: "Detached country residence",
      summary:
        "A considered property-media set presenting the home, its characterful interiors and its mature rural setting.",
      challenge:
        "Show the scale and setting of a tree-lined rural property while keeping the interior sequence natural, clear and inviting.",
      approach:
        "Balance framed exterior compositions and aerial context with wide interior views that preserve the rooms' colour, character and connection to the landscape.",
      deliverables: [
        "Interior and exterior property photography",
        "Aerial drone photography",
        "Ground property video",
        "Measured 2D floor plan",
      ],
      packageName: "Residential property media coverage",
      imageCount: 8,
      heroImage: {
        src: `${COUNTY_GALWAY_PROJECT_MEDIA}/hero-v1.webp`,
        alt: "Front exterior of a detached country residence framed by mature trees",
        width: 2500,
        height: 1406,
      },
      galleryImages: [
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/exterior-v1.webp`,
          alt: "Rear exterior of the residence viewed across its tree-lined garden",
          width: 2000,
          height: 1125,
        },
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/drone-exterior-v1.webp`,
          alt: "Aerial view showing the residence, gardens and surrounding countryside",
          width: 2500,
          height: 1406,
        },
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/living-room-v1.webp`,
          alt: "Living room with garden views, patterned furnishings and timber details",
          width: 2500,
          height: 1667,
        },
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/kitchen-v1.webp`,
          alt: "Long kitchen with dark cabinetry, a central island and pale timber flooring",
          width: 2500,
          height: 1667,
        },
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/kitchen-v2.webp`,
          alt: "Kitchen and dining space looking towards the garden",
          width: 2500,
          height: 1667,
        },
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/bedroom-v1.webp`,
          alt: "Double bedroom with timber furniture and a wide garden-facing window",
          width: 2500,
          height: 1667,
        },
        {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/bathroom-v1.webp`,
          alt: "Blue bathroom with a freestanding bath and timber floor",
          width: 2500,
          height: 1667,
        },
      ],
      photographyFormats: ["photography", "aerialStills"],
      groundVideo: {
        youtubeVideoId: "MTGASk31sGo",
        poster: {
          src: `${COUNTY_GALWAY_PROJECT_MEDIA}/drone-exterior-v1.webp`,
          alt: "Aerial view of a residential property used as the video poster",
          width: 2500,
          height: 1406,
        },
        title: "Detached residence property film",
        description:
          "A landscape property film presenting the residence, its interiors and rural setting.",
        width: 16,
        height: 9,
      },
      floorPlanImages: [
        {
          src: `${FLOOR_PLAN_MEDIA}/1st_floor_cahertrim__killenadeema_loughrea_with_dim.jpg`,
          alt: "Measured 2D first-floor plan for a County Galway property",
          caption: "First floor",
          width: 4000,
          height: 3000,
        },
        {
          src: `${FLOOR_PLAN_MEDIA}/2nd_floor_cahertrim__killenadeema_loughrea_with_dim.jpg`,
          alt: "Measured 2D second-floor plan for a County Galway property",
          caption: "Second floor",
          width: 4000,
          height: 3000,
        },
      ],
      featured: true,
      published: true,
      portfolioPermissionConfirmed: true,
      permissionReference: "portfolio-approval-2026-07",
      completedDate: "2026-07",
    },
    {
      slug: "county-galway-residence-2026-08-06",
      anchorId: "county-galway-rural-residence",
      title: "Rural residence in County Galway",
      generalLocation: "County Galway",
      propertyType: "Detached residential property",
      summary:
        "Interior, exterior and aerial photography present the residence, its main living spaces and rural setting. A single property film combines ground-level and aerial footage into a coherent listing overview.",
      challenge:
        "Present the interiors and exterior setting as a concise, connected residential listing sequence.",
      approach:
        "Combine clear room views with aerial perspectives that establish the property and its wider location.",
      deliverables: [
        "Interior and exterior property photography",
        "Aerial drone photography",
        "Property film — ground and aerial footage",
      ],
      packageName: "Residential property media coverage",
      imageCount: 7,
      heroImage: {
        src: `${KILLASCAUL_PROJECT_MEDIA}/front-drone.webp`,
        alt: "Aerial front view of a detached home with lawn and driveway",
        width: 8064,
        height: 4536,
      },
      galleryImages: [
        {
          src: `${KILLASCAUL_PROJECT_MEDIA}/bathroom.webp`,
          alt: "Bathroom with a panelled bath, tiled floor and window",
          width: 5840,
          height: 3893,
        },
        {
          src: `${KILLASCAUL_PROJECT_MEDIA}/bedroom1.webp`,
          alt: "Bedroom with a metal bed frame and roof windows",
          width: 5918,
          height: 3945,
        },
        {
          src: `${KILLASCAUL_PROJECT_MEDIA}/bedroom2.webp`,
          alt: "Bedroom with a sloped ceiling and roof window",
          width: 5984,
          height: 3989,
        },
        {
          src: `${KILLASCAUL_PROJECT_MEDIA}/kitchen.webp`,
          alt: "Kitchen and dining area with an island and garden doors",
          width: 5056,
          height: 3372,
        },
        {
          src: `${KILLASCAUL_PROJECT_MEDIA}/location-shot.webp`,
          alt: "Aerial location view across fields and surrounding countryside",
          width: 8064,
          height: 4536,
        },
        {
          src: `${KILLASCAUL_PROJECT_MEDIA}/sitting-room.webp`,
          alt: "Sitting room with a fireplace, sofas and timber flooring",
          width: 5545,
          height: 3989,
        },
      ],
      photographyFormats: ["photography", "aerialStills"],
      propertyFilm: {
        youtubeVideoId: "U9oni757G90",
        poster: {
          src: `${KILLASCAUL_PROJECT_MEDIA}/front-drone.webp`,
          alt: "Aerial front view of a County Galway property used as the film poster",
          width: 8064,
          height: 4536,
        },
        title: "County Galway property film — ground and aerial footage",
        description:
          "A single property film combining interior and exterior coverage with aerial views of the setting.",
        width: 16,
        height: 9,
      },
      featured: false,
      published: true,
      portfolioPermissionConfirmed: true,
      permissionReference: "portfolio-owner-approval-killascaul-2026-09-15",
    },
    {
      slug: "county-galway-residence-2026-08-22",
      anchorId: "county-galway-residential-property",
      title: "Residential property in County Galway",
      generalLocation: "County Galway",
      propertyType: "Detached residential property",
      summary:
        "A residential media set covering principal interiors, exterior aerial context and a measured two-floor plan. The accompanying property film combines ground-level and aerial footage in one listing film.",
      challenge:
        "Create a clear set of listing media spanning the property layout, principal rooms and exterior context.",
      approach:
        "Pair straightforward interior compositions with complementary aerial views, a combined property film and measured plans.",
      deliverables: [
        "Interior property photography",
        "Aerial drone photography",
        "Property film — ground and aerial footage",
        "Measured 2D floor plan",
      ],
      packageName: "Residential property media coverage",
      imageCount: 6,
      heroImage: {
        src: `${CRAUGHWELL_PROJECT_MEDIA}/front-drone-shot.webp`,
        alt: "Elevated front view of a detached home and its garden",
        width: 8064,
        height: 4536,
      },
      galleryImages: [
        {
          src: `${CRAUGHWELL_PROJECT_MEDIA}/bathroom.webp`,
          alt: "Bathroom with a freestanding bath and chequered floor tiles",
          width: 5933,
          height: 3955,
        },
        {
          src: `${CRAUGHWELL_PROJECT_MEDIA}/bedroom.webp`,
          alt: "Bedroom with timber flooring and a garden-facing window",
          width: 5933,
          height: 3955,
        },
        {
          src: `${CRAUGHWELL_PROJECT_MEDIA}/kitchen.webp`,
          alt: "Kitchen and dining area with timber cabinetry and tiled flooring",
          width: 5933,
          height: 3955,
        },
        {
          src: `${CRAUGHWELL_PROJECT_MEDIA}/nadir-drone.webp`,
          alt: "Top-down aerial view of the home, driveway and gardens",
          width: 8064,
          height: 4536,
        },
        {
          src: `${CRAUGHWELL_PROJECT_MEDIA}/sitting-room.webp`,
          alt: "Sitting room with timber flooring, a fireplace and bay window",
          width: 5933,
          height: 3955,
        },
      ],
      photographyFormats: ["photography", "aerialStills"],
      propertyFilm: {
        youtubeVideoId: "JAQxl0l3Spo",
        poster: {
          src: `${CRAUGHWELL_PROJECT_MEDIA}/front-drone-shot.webp`,
          alt: "Elevated front view of a County Galway property used as the film poster",
          width: 8064,
          height: 4536,
        },
        title: "County Galway residence film — ground and aerial footage",
        description:
          "A single property film combining room coverage with aerial views of the residence and grounds.",
        width: 16,
        height: 9,
      },
      floorPlanImages: [
        {
          src: `${FLOOR_PLAN_MEDIA}/1st_floor_14_d_n_ard_craughwell_with_dim.jpg`,
          alt: "Measured 2D first-floor plan for a County Galway property",
          caption: "First floor",
          width: 4000,
          height: 3000,
        },
        {
          src: `${FLOOR_PLAN_MEDIA}/2nd_floor_14_d_n_ard_craughwell_with_dim.jpg`,
          alt: "Measured 2D second-floor plan for a County Galway property",
          caption: "Second floor",
          width: 4000,
          height: 3000,
        },
      ],
      featured: false,
      published: true,
      portfolioPermissionConfirmed: true,
      permissionReference: "portfolio-owner-approval-craughwell-2026-09-15",
    },
    {
      slug: "county-leitrim-residence-2026-08-03",
      anchorId: "county-leitrim-woodland-residence",
      title: "Woodland residence in County Leitrim",
      generalLocation: "County Leitrim",
      propertyType: "Residential property",
      summary:
        "A concise photographic selection documents the property, its tree-lined approach and connected living spaces. The intentional five-image edit keeps the showcase focused on setting and interior flow.",
      challenge:
        "Show the relationship between the wooded setting, the approach to the property and its connected interiors.",
      approach:
        "Use a restrained sequence of exterior and interior views without expanding beyond the selected five photographs.",
      deliverables: ["Interior and exterior property photography"],
      packageName: "Residential property photography",
      imageCount: 5,
      heroImage: {
        src: `${LOUGH_RYNN_PROJECT_MEDIA}/front-ground.webp`,
        alt: "Front exterior of a residential property framed by mature trees",
        width: 8064,
        height: 4536,
      },
      galleryImages: [
        {
          src: `${LOUGH_RYNN_PROJECT_MEDIA}/road-shot.webp`,
          alt: "Tree-lined approach leading towards the residential property",
          width: 8064,
          height: 4536,
        },
        {
          src: `${LOUGH_RYNN_PROJECT_MEDIA}/sitting-room.webp`,
          alt: "Blue sitting room with upholstered seating and timber flooring",
          width: 5952,
          height: 3968,
        },
        {
          src: `${LOUGH_RYNN_PROJECT_MEDIA}/sitting-room2.webp`,
          alt: "Open living area connecting the staircase, dining space and sun room",
          width: 5929,
          height: 3953,
        },
        {
          src: `${LOUGH_RYNN_PROJECT_MEDIA}/sun-room.webp`,
          alt: "Bright sun room with windows overlooking the garden",
          width: 5983,
          height: 3545,
        },
      ],
      photographyFormats: ["photography"],
      featured: false,
      published: true,
      portfolioPermissionConfirmed: true,
      permissionReference: "portfolio-owner-approval-lough-rynn-2026-09-15",
    },
  ];

export const isPublicPortfolioProject = (
  project: RealEstatePortfolioProject,
): boolean =>
  project.published === true &&
  project.portfolioPermissionConfirmed === true &&
  Boolean(project.permissionReference?.trim());

export const getPublishedPortfolioProjects = (
  projects: readonly RealEstatePortfolioProject[] =
    REAL_ESTATE_PORTFOLIO_PROJECTS,
): readonly RealEstatePortfolioProject[] =>
  projects.filter(isPublicPortfolioProject);

export const getDemonstratedPortfolioFormats = (
  projects: readonly RealEstatePortfolioProject[] =
    REAL_ESTATE_PORTFOLIO_PROJECTS,
): readonly PortfolioFormat[] => {
  const demonstratedFormats = new Set<PortfolioFormat>();

  for (const project of getPublishedPortfolioProjects(projects)) {
    const hasPhotography =
      Boolean(project.heroImage) || project.galleryImages.length > 0;

    if (hasPhotography) {
      project.photographyFormats.forEach((format) =>
        demonstratedFormats.add(format),
      );
    }
    if (project.groundVideo) demonstratedFormats.add("groundVideo");
    if (project.aerialVideo) demonstratedFormats.add("aerialVideo");
    if (project.propertyFilm) demonstratedFormats.add("propertyFilm");
    if (project.socialVideos?.length) {
      demonstratedFormats.add("socialMediaCuts");
    }
    if (project.floorPlanImages?.length) demonstratedFormats.add("floorPlan");
  }

  return PORTFOLIO_FORMAT_ORDER.filter((format) =>
    demonstratedFormats.has(format),
  );
};
