import type { RealEstatePortfolioProject } from "@/lib/realEstatePortfolio";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl, SITE_NAME } from "@/lib/site";

export const REAL_ESTATE_PORTFOLIO_TITLE =
  "Real Estate Photography Portfolio | OpenÉire Studios";
export const REAL_ESTATE_PORTFOLIO_DESCRIPTION =
  "Explore professional property photography, drone media, property films and listing assets created by OpenÉire Studios for properties across Galway and Connacht.";

export const buildPortfolioJsonLd = (
  projects: readonly RealEstatePortfolioProject[],
) => [
  {
    ...buildBreadcrumbJsonLd([
      { name: "Home", url: buildAbsoluteUrl("/") },
      { name: "Real Estate Media", url: buildAbsoluteUrl("/real-estate") },
      {
        name: "Real Estate Media Portfolio",
        url: buildAbsoluteUrl("/real-estate/portfolio"),
      },
    ]),
    "@id": buildAbsoluteUrl("/real-estate/portfolio#breadcrumb"),
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": buildAbsoluteUrl("/real-estate/portfolio#collection"),
    url: buildAbsoluteUrl("/real-estate/portfolio"),
    name: REAL_ESTATE_PORTFOLIO_TITLE,
    description: REAL_ESTATE_PORTFOLIO_DESCRIPTION,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: buildAbsoluteUrl("/"),
    },
    breadcrumb: {
      "@id": buildAbsoluteUrl("/real-estate/portfolio#breadcrumb"),
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
                `/real-estate/portfolio#${project.slug}`,
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

