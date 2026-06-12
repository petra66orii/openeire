import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return buildPageMetadata({
    title: `${slug} | OpenÉire Studios`,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PlaceholderPage
      title={`Blog article: ${slug}`}
      description="Foundation dynamic route for future server-rendered blog article pages."
    />
  );
}
