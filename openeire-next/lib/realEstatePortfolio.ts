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
  socialVideos?: readonly PortfolioVideo[];
  floorPlanImage?: PortfolioImage;
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

export const REAL_ESTATE_PORTFOLIO_PROJECTS: readonly RealEstatePortfolioProject[] =
  [
    {
      slug: "detached-residence-county-galway",
      title: "Detached residence in County Galway",
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
      featured: true,
      published: true,
      portfolioPermissionConfirmed: true,
      permissionReference: "portfolio-approval-2026-07",
      completedDate: "2026-07",
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
    if (project.socialVideos?.length) {
      demonstratedFormats.add("socialMediaCuts");
    }
    if (project.floorPlanImage) demonstratedFormats.add("floorPlan");
  }

  return PORTFOLIO_FORMAT_ORDER.filter((format) =>
    demonstratedFormats.has(format),
  );
};
