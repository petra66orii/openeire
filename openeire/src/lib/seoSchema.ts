export type StructuredData = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  url: string;
};

type ArticleSchemaInput = {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName: string;
  publisherLogo?: string;
};

type ProductSchemaInput = {
  name: string;
  description: string;
  url: string;
  image?: string | string[];
  brandName: string;
  sku?: string;
  price?: number;
  priceCurrency?: string;
  availability?: string;
};

type VisualArtworkSchemaInput = {
  name: string;
  description: string;
  url: string;
  image?: string | string[];
  creatorName: string;
  artform?: string;
};

type FAQItemInput = {
  question: string;
  answer: string;
};

const normalizeImages = (
  image?: string | string[],
): string[] | undefined => {
  if (!image) return undefined;
  const images = Array.isArray(image) ? image : [image];
  const cleaned = images.filter(Boolean);
  return cleaned.length ? cleaned : undefined;
};

export const buildOrganizationSchema = (input: {
  type?: "Organization" | "OnlineStore";
  name: string;
  alternateName?: string;
  url: string;
  logo?: string;
  description?: string;
  contactEmail?: string;
  sameAs?: string[];
}): StructuredData => ({
  "@context": "https://schema.org",
  "@type": input.type ?? "Organization",
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

export const buildWebsiteSchema = (input: {
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

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const buildArticleSchema = (input: ArticleSchemaInput): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: input.headline,
  description: input.description,
  url: input.url,
  image: normalizeImages(input.image),
  datePublished: input.datePublished,
  dateModified: input.dateModified ?? input.datePublished,
  author: {
    "@type": "Person",
    name: input.authorName,
  },
  publisher: {
    "@type": "Organization",
    name: input.publisherName,
    ...(input.publisherLogo ? { logo: input.publisherLogo } : {}),
  },
  mainEntityOfPage: input.url,
});

export const buildProductSchema = (input: ProductSchemaInput): StructuredData => {
  const schema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
  };

  if (input.sku) {
    schema.sku = input.sku;
  }

  if (input.image) {
    schema.image = normalizeImages(input.image);
  }

  if (typeof input.price === "number" && Number.isFinite(input.price)) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: input.priceCurrency ?? "EUR",
      price: input.price.toFixed(2),
      availability: input.availability ?? "https://schema.org/InStock",
      url: input.url,
    };
  }

  return schema;
};

export const buildVisualArtworkSchema = (
  input: VisualArtworkSchemaInput,
): StructuredData => {
  const schema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: input.name,
    description: input.description,
    url: input.url,
    creator: {
      "@type": "Organization",
      name: input.creatorName,
    },
    mainEntityOfPage: input.url,
  };

  if (input.artform) {
    schema.artform = input.artform;
  }

  if (input.image) {
    schema.image = normalizeImages(input.image);
  }

  return schema;
};

export const buildFAQPageSchema = (
  items: FAQItemInput[],
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

