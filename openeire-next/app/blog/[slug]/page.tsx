/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedBlogPostBySlug } from "@/lib/api/blog";
import { formatBlogDisplayDate } from "@/lib/blog/dates";
import { resolveMediaUrl } from "@/lib/media";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl, getSiteUrl, SITE_NAME } from "@/lib/site";
import { sanitizeRichHtml } from "@/lib/sanitizeRichHtml";
import {
  FaArrowLeft,
  FaCalendar,
  FaRegHeart,
  FaUser,
} from "react-icons/fa";

export const revalidate = 300;

const getCanonicalUrl = (slug: string, canonicalUrl?: string): string => {
  const generated = buildAbsoluteUrl(`/blog/${slug}`);
  if (!canonicalUrl) return generated;

  try {
    const url = new URL(canonicalUrl);
    return url.origin === getSiteUrl() ? url.toString() : generated;
  } catch {
    return generated;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPublishedBlogPostBySlug(slug);
    if (!post) {
      return {
        title: "Journal post not found | OpenÉire Studios",
        robots: { index: false, follow: false },
      };
    }

    const title = post.meta_title || post.title;
    const description = post.meta_description || post.excerpt || "";
    const canonical = getCanonicalUrl(post.slug, post.canonical_url);
    const featuredImage = resolveMediaUrl(post.featured_image);
    const image = featuredImage ? buildAbsoluteUrl(featuredImage) : undefined;

    return {
      metadataBase: new URL(getSiteUrl()),
      title,
      description,
      alternates: { canonical },
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
        title,
        description,
        url: canonical,
        siteName: SITE_NAME,
        type: "article",
        publishedTime: post.created_at,
        modifiedTime: post.updated_at || post.created_at,
        authors: post.author ? [post.author] : undefined,
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      title: "Journal | OpenÉire Studios",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let failedToLoad = false;
  const post = await getPublishedBlogPostBySlug(slug).catch(() => {
    failedToLoad = true;
    return null;
  });

  if (failedToLoad) {
    return (
      <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black px-4 pt-36 pb-24 text-center text-white">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-gray-900/50 p-8">
          <h1 className="font-serif text-3xl font-bold">
            This story is unavailable right now.
          </h1>
          <p className="mt-4 text-gray-400">
            Please try again shortly while we reconnect to the studio archive.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  if (!post) notFound();

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || "";
  const canonical = getCanonicalUrl(post.slug, post.canonical_url);
  const featuredImage = resolveMediaUrl(post.featured_image);
  const absoluteFeaturedImage = featuredImage
    ? buildAbsoluteUrl(featuredImage)
    : undefined;
  const sanitizedContent = sanitizeRichHtml(post.content ?? "");
  const visiblePublishedDate = formatBlogDisplayDate(
    post.created_at,
    "Date unavailable",
  );

  return (
    <div className="mobile-page-offset min-h-screen bg-black pb-20 pt-36 text-white">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: buildAbsoluteUrl("/") },
            { name: "Journal", url: buildAbsoluteUrl("/blog") },
            { name: title, url: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description,
            mainEntityOfPage: canonical,
            url: canonical,
            ...(absoluteFeaturedImage ? { image: absoluteFeaturedImage } : {}),
            datePublished: post.created_at,
            dateModified: post.updated_at || post.created_at,
            ...(post.author
              ? {
                  author: {
                    "@type": "Person",
                    name: post.author,
                  },
                }
              : {}),
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          },
        ]}
      />

      <div className="container mx-auto max-w-4xl px-4 lg:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <FaArrowLeft className="mr-2" /> Back to Journal
        </Link>

        <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
          {post.title}
        </h1>

        <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-white/10 pb-8 font-mono text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <FaUser className="text-accent" /> {post.author}
          </div>
          <div className="flex items-center gap-2">
            <FaCalendar className="text-accent" /> {visiblePublishedDate}
          </div>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-accent hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {featuredImage ? (
          <div className="mb-12 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img src={featuredImage} alt={post.title} className="h-auto w-full" />
          </div>
        ) : null}

        <article className="blog-content">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </article>

        <div className="mt-16 flex flex-col items-center border-t border-white/10 pt-8">
          <div className="mb-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-gray-400">
            <FaRegHeart />
            <span>{post.likes_count} Likes</span>
          </div>

          <div className="text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              Share this story
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:border-accent hover:text-accent"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:border-accent hover:text-accent"
              >
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition hover:border-accent hover:text-accent"
              >
                X
              </a>
            </div>
          </div>
        </div>

        {post.related_posts?.length ? (
          <div className="mt-20 border-t border-white/10 pt-10">
            <h2 className="mb-8 font-serif text-2xl font-bold text-white">
              Read Next
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {post.related_posts.map((related) => {
                const relatedImage = resolveMediaUrl(related.featured_image);

                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block overflow-hidden rounded-xl border border-white/10 bg-gray-900 transition-all hover:border-accent/50"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedImage ?? "https://via.placeholder.com/400"}
                        alt=""
                        className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold leading-tight text-white transition-colors group-hover:text-accent">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-20 rounded-2xl border border-white/5 bg-gray-900/50 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">
            Discussion
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Comments and authenticated likes remain available in the current
            React app. This server-rendered migration preserves article content,
            sharing, and related-post discovery first.
          </p>
        </div>
      </div>
    </div>
  );
}
