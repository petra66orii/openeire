export type StructuredData = Record<string, unknown>;

export const buildOrganizationJsonLd = (input: {
  name: string;
  alternateName?: string;
  url: string;
  logo?: string;
  description?: string;
  contactEmail?: string;
  sameAs?: string[];
}): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: input.name,
  ...(input.alternateName ? { alternateName: input.alternateName } : {}),
  url: input.url,
  ...(input.logo ? { logo: input.logo } : {}),
  ...(input.description ? { description: input.description } : {}),
  ...(input.contactEmail
    ? {
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: input.contactEmail,
          },
        ],
      }
    : {}),
  ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
});

export const buildWebsiteJsonLd = (input: {
  name: string;
  alternateName?: string;
  url: string;
}): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: input.name,
  ...(input.alternateName ? { alternateName: input.alternateName } : {}),
  url: input.url,
});

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; url: string }>,
): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
