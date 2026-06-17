import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { GalleryProductCard } from "@/components/gallery/GalleryProductCard";
import { ProductMediaPreview } from "@/components/gallery/ProductMediaPreview";
import { SpecBox } from "@/components/gallery/SpecBox";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { ShareControls } from "@/components/share/ShareControls";
import { getPublicPhysicalProduct } from "@/lib/api/gallery";
import { getProductReviews } from "@/lib/api/reviews";
import { formatEuro, getLowestVariant, splitTags } from "@/lib/gallery/format";
import { resolveMediaUrl } from "@/lib/media";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl, getSiteUrl, SITE_NAME } from "@/lib/site";
import { FaShieldAlt, FaShippingFast } from "react-icons/fa";

export const revalidate = 300;

const getProductPath = (id: string | number) => `/gallery/physical/${id}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getPublicPhysicalProduct(id);
    if (!product) {
      return {
        title: "Art print not found | OpenÉire Studios",
        robots: { index: false, follow: false },
      };
    }

    const path = getProductPath(product.id);
    const description =
      product.description ||
      `Premium fine art print of ${product.title} from OpenÉire Studios.`;
    const image = resolveMediaUrl(product.preview_image);

    return {
      metadataBase: new URL(getSiteUrl()),
      title: `${product.title} | OpenÉire Studios`,
      description,
      alternates: { canonical: buildAbsoluteUrl(path) },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
        },
      },
      openGraph: {
        title: product.title,
        description,
        url: buildAbsoluteUrl(path),
        siteName: SITE_NAME,
        type: "website",
        images: image ? [{ url: buildAbsoluteUrl(image) }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description,
        images: image ? [buildAbsoluteUrl(image)] : undefined,
      },
    };
  } catch {
    return {
      title: "Art Prints | OpenÉire Studios",
      robots: { index: false, follow: false },
    };
  }
}

export default async function PhysicalProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let failedToLoad = false;
  const product = await getPublicPhysicalProduct(id).catch(() => {
    failedToLoad = true;
    return null;
  });

  if (failedToLoad) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-gray-900/50 p-8">
          <h1 className="font-serif text-3xl font-bold">
            This print is unavailable right now.
          </h1>
          <p className="mt-4 text-gray-400">
            Please try again shortly while we reconnect to the studio archive.
          </p>
          <Link
            href="/gallery/physical"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  const imageUrl = resolveMediaUrl(product.preview_image);
  const lowestVariant = getLowestVariant(product.variants);
  const selectedPrice = formatEuro(lowestVariant?.price);
  const tags = splitTags(product.tags);
  const canonical = buildAbsoluteUrl(getProductPath(product.id));
  const absoluteImage = imageUrl ? buildAbsoluteUrl(imageUrl) : undefined;
  let reviewsFailed = false;
  const approvedReviews = await getProductReviews("photo", product.id, {
    cache: "no-store",
  }).catch(() => {
    reviewsFailed = true;
    return [];
  });
  const averageRating =
    product.average_rating === null || product.average_rating === undefined
      ? 0
      : Number(product.average_rating);
  const reviewCount = Number(product.review_count ?? 0);
  const hasRealRating =
    Number.isFinite(averageRating) && averageRating > 0 && reviewCount > 0;

  return (
    <div className="page-top-offset min-h-screen overflow-x-hidden bg-black pb-20 font-sans text-white selection:bg-accent selection:text-black">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: buildAbsoluteUrl("/") },
            { name: "Art Prints", url: buildAbsoluteUrl("/art-prints") },
            { name: "Gallery", url: buildAbsoluteUrl("/gallery/physical") },
            { name: product.title, url: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description || product.title,
            url: canonical,
            ...(absoluteImage ? { image: [absoluteImage] } : {}),
            brand: {
              "@type": "Brand",
              name: SITE_NAME,
            },
            ...(hasRealRating
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: averageRating.toFixed(1),
                    reviewCount,
                  },
                }
              : {}),
            ...(approvedReviews.length
              ? {
                  review: approvedReviews.map((review) => ({
                    "@type": "Review",
                    author: {
                      "@type": "Person",
                      name: review.user,
                    },
                    datePublished: review.created_at,
                    reviewBody: review.comment || undefined,
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: review.rating,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  })),
                }
              : {}),
            ...(lowestVariant
              ? {
                  sku: lowestVariant.sku || undefined,
                  offers: {
                    "@type": "Offer",
                    price: Number.parseFloat(lowestVariant.price),
                    priceCurrency: "EUR",
                    availability: "https://schema.org/InStock",
                    url: canonical,
                  },
                }
              : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            name: product.title,
            description: product.description || product.title,
            url: canonical,
            ...(absoluteImage ? { image: absoluteImage } : {}),
            creator: {
              "@type": "Organization",
              name: SITE_NAME,
            },
            artform: "Photography",
          },
        ]}
      />

      <div className="container mx-auto px-4 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <Link
            href="/art-prints"
            className="transition-colors hover:text-accent"
          >
            Art Prints
          </Link>
          <span>/</span>
          <Link
            href="/gallery/physical"
            className="transition-colors hover:text-accent"
          >
            Gallery
          </Link>
          <span>/</span>
          <span className="max-w-50 truncate text-white">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-8">
            <div className="sticky top-32">
              <div className="relative mx-auto w-fit overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
                <ProductMediaPreview
                  imageUrl={imageUrl}
                  title={product.title}
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-4">
                <SpecBox label="Resolution" value="High Res" />
                <SpecBox label="Format" value="Fine Art / JPEG" />
                <SpecBox label="Frame Rate" value="N/A" />
                <SpecBox label="Duration" value="N/A" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-sm md:p-8">
              <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
                {product.title}
              </h1>

              {product.description ? (
                <p className="mb-8 border-l-2 border-accent pl-4 text-sm leading-relaxed text-gray-400">
                  {product.description}
                </p>
              ) : null}

              <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-gray-300">
                Made to order as a premium fine art print. Shipping is
                calculated at checkout.
              </div>

              {product.variants.length ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
                      Available print options
                    </label>
                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="rounded-lg border border-white/10 bg-black/40 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">
                                {variant.material_display}
                              </p>
                              <p className="text-sm text-gray-400">
                                {variant.size_display}
                              </p>
                            </div>
                            <p className="font-serif text-lg font-bold text-white">
                              €{formatEuro(variant.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="mb-6 flex items-end justify-between">
                      <span className="text-sm font-medium text-gray-400">
                        From
                      </span>
                      <span className="font-serif text-4xl font-bold text-white">
                        €{selectedPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-brand-700/60 py-4 text-lg font-bold text-paper shadow-[0_0_20px_rgba(0,196,0,0.12)]"
                    >
                      Add to Cart
                    </button>

                    <p className="mt-4 px-4 text-center text-[11px] leading-relaxed text-gray-500">
                      Cart and checkout actions remain in the current React
                      storefront until the checkout migration PR. Art prints are
                      sold for personal display only and do not include
                      reproduction or commercial usage rights.
                    </p>

                    <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-wider text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaShieldAlt /> Secure
                      </span>
                      <span className="flex items-center gap-1">
                        <FaShippingFast /> US & IE Ship
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-400">
                  Print options are unavailable right now.
                </div>
              )}
            </div>

            {tags.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.slice(0, 12).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <ShareControls title={product.title} url={canonical} />
          </div>
        </div>

        <ProductReviews
          productType="photo"
          productId={product.id}
          initialReviews={approvedReviews}
          initialLoadError={reviewsFailed}
        />

        {product.related_products?.length ? (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-2xl font-bold text-white">
              Related Prints
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {product.related_products.map((related) => (
                <GalleryProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
