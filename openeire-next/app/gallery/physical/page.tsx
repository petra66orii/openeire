import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryProductCard } from "@/components/gallery/GalleryProductCard";
import { GalleryToolbar } from "@/components/gallery/GalleryToolbar";
import { getPublicGalleryItems } from "@/lib/api/gallery";
import {
  getCollectionLabel,
  isGalleryCollectionAvailable,
} from "@/lib/gallery/collections";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl, getSiteUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 300;

type GallerySearchParams = {
  collection?: string;
  search?: string;
  sort?: string;
  page?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<GallerySearchParams>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search?.trim();
  const collection = resolvedSearchParams?.collection?.trim();
  const collectionLabel = getCollectionLabel(collection);
  const title =
    collection && collection !== "all"
      ? `${collectionLabel} Fine Art Prints | OpenÉire Studios`
      : "Fine Art Prints Ireland | Premium Aerial Photography Artwork";
  const description =
    collection && collection !== "all"
      ? `Browse ${collectionLabel} fine art prints from OpenÉire Studios, with curated aerial photography artwork for interiors, collectors, and gifts.`
      : "Browse premium fine art prints from OpenÉire Studios for collectors, interiors, and gifts, with archival production and shipping calculated at checkout.";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: { canonical: buildAbsoluteUrl("/gallery/physical") },
    robots: search
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
          },
        },
    openGraph: {
      title,
      description,
      url: buildAbsoluteUrl("/gallery/physical"),
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: buildAbsoluteUrl("/hero-poster.jpg") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [buildAbsoluteUrl("/hero-poster.jpg")],
    },
  };
}

export default async function PhysicalGalleryPage({
  searchParams,
}: {
  searchParams?: Promise<GallerySearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const collection = resolvedSearchParams?.collection?.trim() || "all";
  const search = resolvedSearchParams?.search?.trim();
  const sort = resolvedSearchParams?.sort?.trim() || "date_desc";
  const page = resolvedSearchParams?.page;
  const collectionLabel = getCollectionLabel(collection);
  const isCollectionComingSoon = !isGalleryCollectionAvailable(collection);
  let failedToLoad = false;
  const response = isCollectionComingSoon
    ? { count: 0, next: null, previous: null, results: [] }
    : await getPublicGalleryItems({
        type: "physical",
        collection,
        search,
        sort,
        page,
      }).catch(() => {
        failedToLoad = true;
        return { count: 0, next: null, previous: null, results: [] };
      });

  const products = response.results;
  const showFilterState = Boolean(search || (collection && collection !== "all"));

  return (
    <div className="page-top-offset min-h-screen bg-black pb-20 text-white">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: buildAbsoluteUrl("/") },
            { name: "Art Prints", url: buildAbsoluteUrl("/art-prints") },
            { name: "Gallery", url: buildAbsoluteUrl("/gallery/physical") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Fine Art Prints Gallery",
            url: buildAbsoluteUrl("/gallery/physical"),
            description:
              "Premium aerial photography prints from OpenÉire Studios.",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: buildAbsoluteUrl(`/gallery/physical/${product.id}`),
              name: product.title,
            })),
          },
        ]}
      />

      <GalleryHero activeCollection={collection} />

      <div className="container mx-auto mb-4 mt-2 px-4 lg:hidden lg:px-8">
        <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">
            Art prints with impact
          </div>
          <h2 className="mt-2 font-serif text-lg font-bold text-white">
            Shop statement pieces made for interiors and collectors.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Swipe right to filter by country and scroll down. Open any print for
            details, and use search to find a piece that feels ready to hang.
          </p>
        </div>
      </div>

      <GalleryToolbar search={search} sort={sort} collection={collection} />

      <div
        id="gallery-grid"
        className="container relative z-10 mx-auto px-4 lg:px-8"
      >
        {showFilterState ? (
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {collection !== "all" ? collectionLabel : "All collections"}
            </span>
            {search ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Search: {search}
              </span>
            ) : null}
            <Link href="/gallery/physical" className="text-accent hover:underline">
              Clear filters
            </Link>
          </div>
        ) : null}

        {failedToLoad ? (
          <div className="py-20 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">
              Gallery unavailable right now.
            </h2>
            <p className="mt-3 text-gray-400">
              Please try again shortly while we reconnect to the studio archive.
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <GalleryProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            {isCollectionComingSoon ? (
              <>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {collectionLabel} is coming soon!
                </h2>
                <p className="mt-3 text-gray-400">
                  We&apos;re curating this collection now. Check back soon for
                  new releases.
                </p>
              </>
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
