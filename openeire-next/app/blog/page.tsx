/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedBlogPosts } from "@/lib/api/blog";
import { formatBlogDisplayDate } from "@/lib/blog/dates";
import { resolveMediaUrl } from "@/lib/media";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildAbsoluteUrl } from "@/lib/site";
import type { BlogPostListItem } from "@/types/blog";
import { FaCalendarAlt, FaHeart, FaTag, FaUser } from "react-icons/fa";

export const revalidate = 300;

export const metadata = buildPageMetadata({
  title: "Journal | OpenÉire Studios",
  description:
    "Read behind-the-scenes notes, drone capture stories, and photography insights from OpenÉire Studios.",
  path: "/blog",
});

function BlogPostCard({ post }: { post: BlogPostListItem }) {
  const imageUrl = resolveMediaUrl(post.featured_image);
  const visibleDate = formatBlogDisplayDate(post.created_at, "Date unavailable");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={imageUrl ?? "https://via.placeholder.com/800x600?text=OpenEire+Journal"}
          alt={post.title}
          className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
          <FaCalendarAlt className="text-accent" />
          {visibleDate}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-6">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
          <FaUser /> {post.author}
        </div>

        <h2 className="mb-3 font-serif text-2xl font-bold leading-tight text-white transition-colors group-hover:text-accent">
          {post.title}
        </h2>

        <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-400">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-gray-300 transition-colors group-hover:bg-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-gray-500 transition-colors group-hover:text-red-500">
            <FaHeart /> {post.likes_count}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentTag = resolvedSearchParams?.tag?.trim();
  const currentPage = resolvedSearchParams?.page;

  let posts: BlogPostListItem[] = [];
  let failedToLoad = false;

  try {
    const response = await getPublishedBlogPosts({
      tag: currentTag || undefined,
      page: currentPage,
    });
    posts = response.results;
  } catch {
    failedToLoad = true;
  }

  return (
    <div className="page-top-offset min-h-screen bg-black pb-20 text-white">
      {!currentTag ? (
        <JsonLd
          data={[
            buildBreadcrumbJsonLd([
              { name: "Home", url: buildAbsoluteUrl("/") },
              { name: "Journal", url: buildAbsoluteUrl("/blog") },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "The Journal",
              url: buildAbsoluteUrl("/blog"),
              description:
                "Behind-the-scenes notes, drone capture stories, and photography insights from OpenÉire Studios.",
            },
          ]}
        />
      ) : null}

      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight md:text-7xl">
            The Journal
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light text-gray-400">
            Behind the scenes, photography tips, and stories from the Irish
            landscape.
          </p>

          {currentTag ? (
            <div className="animate-fade-in-up mt-8 inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-6 py-2 text-accent backdrop-blur-md">
              <FaTag className="mr-2" />
              <span>
                Filtering by: <strong>#{currentTag}</strong>
              </span>
              <Link
                href="/blog"
                className="ml-4 transition-colors hover:text-white"
              >
                {"\u2715"}
              </Link>
            </div>
          ) : null}
        </div>

        {failedToLoad ? (
          <div className="rounded-2xl border border-white/10 bg-gray-900/50 py-20 text-center">
            <h2 className="mb-2 text-xl font-bold text-white">
              The journal is unavailable right now.
            </h2>
            <p className="text-gray-500">
              Please try again shortly while we reconnect to the studio archive.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-gray-900/50 py-20 text-center">
            <h2 className="mb-2 text-xl font-bold text-white">
              No stories found.
            </h2>
            <p className="text-gray-500">Try clearing your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
