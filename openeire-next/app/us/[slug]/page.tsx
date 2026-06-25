import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { USPrintLandingPage } from "@/components/marketing/USPrintLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getUSLandingPage, US_LANDING_PAGES } from "@/lib/us/landingPages";

export const dynamicParams = false;

export function generateStaticParams() {
  return US_LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getUSLandingPage(slug);
  if (!page) return {};
  return buildPageMetadata({ title: page.title, description: page.description, path: `/us/${page.slug}` });
}

export default async function USLandingRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getUSLandingPage(slug);
  if (!page) notFound();
  return <USPrintLandingPage page={page} />;
}
