"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { useToast } from "@/components/ui/ToastProvider";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import { getLikedBlogPosts, toggleBlogLike } from "@/lib/api/blog";
import { resolveMediaUrl } from "@/lib/media";
import type { BlogPostListItem } from "@/types/blog";

const dateFormatter = new Intl.DateTimeFormat("en-IE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatDate = (value?: string | null) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return dateFormatter.format(date);
};

function LoadingState() {
  return (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
      <div className="h-8 w-56 rounded bg-white/10" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-xl border border-white/10 bg-black"
          >
            <div className="h-48 bg-white/10" />
            <div className="space-y-4 p-5">
              <div className="h-5 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-gray-600">
        <FaHeart className="text-2xl" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-white">
        You haven&apos;t saved any stories yet.
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        Browse the journal and save aerial stories, location notes, and studio
        updates you want to revisit.
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
      >
        Browse Journal
      </Link>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-950/30 px-6 py-10 text-center">
      <h3 className="font-serif text-2xl font-bold text-white">
        Saved stories could not be loaded.
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-red-100/80">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
      >
        Try Again
      </button>
    </div>
  );
}

function SavedStoryCard({
  isRemoving,
  onRemove,
  post,
}: {
  isRemoving: boolean;
  onRemove: (post: BlogPostListItem) => void;
  post: BlogPostListItem;
}) {
  const imageUrl = resolveMediaUrl(post.featured_image);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black transition-all hover:-translate-y-1 hover:border-accent/50">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-gray-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-900 text-xs font-bold uppercase tracking-widest text-gray-600">
              OpenÉire Journal
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-red-500 backdrop-blur-md">
            <FaHeart aria-hidden="true" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {post.excerpt}
          </p>
        </Link>

        <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 transition-colors hover:text-white"
          >
            <span>{formatDate(post.created_at)}</span>
            <span aria-hidden="true">/</span>
            Read Story
            <FaArrowRight aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => onRemove(post)}
            disabled={isRemoving}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-red-400/50 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Remove ${post.title} from saved stories`}
          >
            <FaRegHeart aria-hidden="true" />
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function SavedStoriesSection() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingSlugs, setPendingSlugs] = useState<Set<string>>(() => new Set());

  const loadSavedStories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getLikedBlogPosts();
      setPosts(response.results);
    } catch (error) {
      setErrorMessage(
        normalizeAuthErrorMessage(
          error,
          "Could not load your saved stories. Please try again shortly.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSavedStories();
  }, [loadSavedStories]);

  const handleRemove = async (post: BlogPostListItem) => {
    if (pendingSlugs.has(post.slug)) return;

    setPendingSlugs((current) => new Set(current).add(post.slug));
    try {
      const result = await toggleBlogLike(post.slug);
      if (!result.liked) {
        setPosts((current) => current.filter((item) => item.slug !== post.slug));
        showToast("Story removed from saved stories.", "success");
      } else {
        showToast("This story is still saved.", "info");
      }
    } catch (error) {
      showToast(
        normalizeAuthErrorMessage(
          error,
          "Could not update your saved stories. Please try again.",
        ),
        "error",
      );
    } finally {
      setPendingSlugs((current) => {
        const next = new Set(current);
        next.delete(post.slug);
        return next;
      });
    }
  };

  if (isLoading) return <LoadingState />;
  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={loadSavedStories} />;
  }
  if (posts.length === 0) return <EmptyState />;

  return (
    <section aria-labelledby="saved-stories-heading">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2
          id="saved-stories-heading"
          className="font-serif text-3xl font-bold text-white"
        >
          Saved Stories
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Articles you have saved from the OpenÉire Studios journal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <SavedStoryCard
            key={post.id}
            post={post}
            isRemoving={pendingSlugs.has(post.slug)}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </section>
  );
}
