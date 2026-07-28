export type PortfolioImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type PortfolioVideo = {
  src: string;
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
  landscapeVideo?: PortfolioVideo;
  verticalVideo?: PortfolioVideo;
  floorPlanImage?: PortfolioImage;
  services: readonly string[];
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
export const REAL_ESTATE_PORTFOLIO_PROJECTS: readonly RealEstatePortfolioProject[] =
  [];

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

