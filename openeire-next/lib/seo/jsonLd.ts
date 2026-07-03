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

export const buildOpenEireLocalBusinessJsonLd = (input: {
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  image: string;
  email: string;
  sameAs?: string[];
}): StructuredData => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${input.url.replace(/\/+$/, "")}/#localbusiness`,
  name: input.name,
  ...(input.alternateName ? { alternateName: input.alternateName } : {}),
  url: input.url,
  logo: input.logo,
  image: input.image,
  email: input.email,
  description:
    "Premium aerial photography, fine art prints, property media, commercial licensing, and curated visual assets from Ireland.",
  priceRange: "€175+VAT to POA",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Loughrea",
    addressRegion: "Co. Galway",
    addressCountry: "IE",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Connacht" },
    { "@type": "AdministrativeArea", name: "Galway" },
    { "@type": "AdministrativeArea", name: "Mayo" },
    { "@type": "AdministrativeArea", name: "Roscommon" },
    { "@type": "AdministrativeArea", name: "Sligo" },
    { "@type": "AdministrativeArea", name: "Leitrim" },
    { "@type": "Country", name: "Ireland" },
  ],
  serviceType: [
    "Real estate photography",
    "Drone photography",
    "Drone videography",
    "3D virtual tours",
    "Fine art prints",
    "Rights-managed aerial media licensing",
  ],
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Appointments",
      value: "By appointment only",
    },
  ],
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

export const buildFaqPageJsonLd = (
  items: Array<{ question: string; answer: string }>,
): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});
