import type { RealEstatePortfolioProject } from "@/lib/realEstatePortfolio";
import { REAL_ESTATE_PORTFOLIO_PATH } from "@/lib/realEstatePresentation";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl, SITE_NAME } from "@/lib/site";

export const REAL_ESTATE_PORTFOLIO_TITLE =
  "Real Estate Photography Portfolio | OpenÉire Studios";
export const REAL_ESTATE_PORTFOLIO_DESCRIPTION =
  "Explore approved property photography, aerial media and published project work created by OpenÉire Studios for properties across Galway and Connacht.";

export const buildPortfolioJsonLd = (
  projects: readonly RealEstatePortfolioProject[],
) => [
  {
    ...buildBreadcrumbJsonLd([
      { name: "Home", url: buildAbsoluteUrl("/") },
      { name: "Real Estate Media", url: buildAbsoluteUrl("/real-estate") },
      {
        name: "Real Estate Media Portfolio",
        url: buildAbsoluteUrl(REAL_ESTATE_PORTFOLIO_PATH),
      },
    ]),
    "@id": buildAbsoluteUrl(`${REAL_ESTATE_PORTFOLIO_PATH}#breadcrumb`),
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": buildAbsoluteUrl(`${REAL_ESTATE_PORTFOLIO_PATH}#collection`),
    url: buildAbsoluteUrl(REAL_ESTATE_PORTFOLIO_PATH),
    name: REAL_ESTATE_PORTFOLIO_TITLE,
    description: REAL_ESTATE_PORTFOLIO_DESCRIPTION,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: buildAbsoluteUrl("/"),
    },
    breadcrumb: {
      "@id": buildAbsoluteUrl(`${REAL_ESTATE_PORTFOLIO_PATH}#breadcrumb`),
    },
    ...(projects.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.map((project, index) => ({
              "@type": "CreativeWork",
              position: index + 1,
              name: project.title,
              description: project.summary,
              url: buildAbsoluteUrl(
                `${REAL_ESTATE_PORTFOLIO_PATH}#${project.slug}`,
              ),
              contentLocation: {
                "@type": "Place",
                name: project.generalLocation,
              },
              ...(project.completedDate
                ? { dateCreated: project.completedDate }
                : {}),
              ...(project.heroImage
                ? {
                    image: {
                      "@type": "ImageObject",
                      contentUrl: buildAbsoluteUrl(project.heroImage.src),
                      caption: project.heroImage.alt,
                      width: project.heroImage.width,
                      height: project.heroImage.height,
                    },
                  }
                : {}),
            })),
          },
        }
      : {}),
  },
];
