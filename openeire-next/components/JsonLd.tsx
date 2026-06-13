import type { StructuredData } from "@/lib/seo/jsonLd";

const serializeJsonLd = (data: StructuredData | StructuredData[]): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export function JsonLd({ data }: { data: StructuredData | StructuredData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
