import { describe, expect, it } from "vitest";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildProductSchema,
  buildVisualArtworkSchema,
  buildWebsiteSchema,
} from "../src/lib/seoSchema";

describe("seoSchema helpers", () => {
  it("builds breadcrumb positions sequentially", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Home", url: "https://example.com/" },
      { name: "Gallery", url: "https://example.com/gallery" },
      { name: "Prints", url: "https://example.com/gallery/physical" },
    ]);

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://example.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Gallery",
          item: "https://example.com/gallery",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Prints",
          item: "https://example.com/gallery/physical",
        },
      ],
    });
  });

  it("formats product offers with a fixed two-decimal price", () => {
    const schema = buildProductSchema({
      name: "Cliffs at Dusk",
      description: "Premium aerial print",
      url: "https://example.com/gallery/physical/cliffs-at-dusk",
      brandName: "OpenEire Studios",
      price: 149.5,
      priceCurrency: "EUR",
    });

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Cliffs at Dusk",
      brand: {
        "@type": "Brand",
        name: "OpenEire Studios",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: "149.50",
        availability: "https://schema.org/InStock",
        url: "https://example.com/gallery/physical/cliffs-at-dusk",
      },
    });
  });

  it("builds article and artwork schema with the required base fields", () => {
    expect(
      buildArticleSchema({
        headline: "Journal post",
        description: "A behind-the-scenes story",
        url: "https://example.com/blog/journal-post",
        datePublished: "2026-04-20T00:00:00.000Z",
        authorName: "OpenEire",
        publisherName: "OpenEire Studios",
      }),
    ).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Journal post",
      mainEntityOfPage: "https://example.com/blog/journal-post",
    });

    expect(
      buildVisualArtworkSchema({
        name: "West Coast Print",
        description: "Fine art print",
        url: "https://example.com/gallery/physical/west-coast-print",
        creatorName: "OpenEire Studios",
        artform: "Photography",
      }),
    ).toMatchObject({
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      name: "West Coast Print",
      artform: "Photography",
      mainEntityOfPage: "https://example.com/gallery/physical/west-coast-print",
    });
  });

  it("builds website schema with the configured name and url", () => {
    expect(
      buildWebsiteSchema({
        name: "OpenEire Studios",
        url: "https://example.com",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "OpenEire Studios",
      url: "https://example.com",
    });
  });
});
