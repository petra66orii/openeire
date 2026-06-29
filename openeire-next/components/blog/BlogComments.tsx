"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { getBlogComments, postBlogComment } from "@/lib/api/blog";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import type { BlogComment } from "@/types/blog";

const formatCommentDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export function BlogComments({ slug }: { slug: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [content, setContent] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingComments(true);
    setErrorMessage(null);

    getBlogComments(slug, controller.signal)
      .then(setComments)
      .catch(() => {
        if (!controller.signal.aborted) {
          setErrorMessage("Could not load comments right now.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingComments(false);
      });

    return () => controller.abort();
  }, [slug]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await postBlogComment(slug, trimmedContent);
      setContent("");
      setSuccessMessage(
        "Comment submitted for approval. It will appear here once reviewed.",
      );
      showToast("Comment submitted for approval.", "success");
    } catch (error) {
      setErrorMessage(
        normalizeAuthErrorMessage(
          error,
          "Could not post your comment. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-20 rounded-2xl border border-white/5 bg-gray-900/50 p-8">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">
          Discussion
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Join the conversation around this story.
        </p>
      </div>

      {isLoading ? null : isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          <label htmlFor="blog-comment-content" className="sr-only">
            Comment
          </label>
          <textarea
            id="blog-comment-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            maxLength={1200}
            placeholder="Share your thoughts..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-accent"
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mb-10 rounded-2xl border border-accent/20 bg-accent/10 p-5 text-sm text-gray-200">
          <Link href="/login" className="font-bold text-accent hover:text-white">
            Log in
          </Link>{" "}
          to leave a comment.
        </div>
      )}

      {errorMessage ? (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-6 rounded-2xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-sm text-brand-100">
          {successMessage}
        </div>
      ) : null}

      {isLoadingComments ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-white/5 bg-black/30 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {comment.user?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {comment.user || "OpenEire reader"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCommentDate(comment.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                {comment.content}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No comments yet. Start the conversation.
        </p>
      )}
    </section>
  );
}
