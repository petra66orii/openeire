"use client";

import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import { getBlogPostLikeState, toggleBlogLike } from "@/lib/api/blog";

interface BlogLikeButtonProps {
  initialHasLiked?: boolean;
  initialLikesCount: number;
  slug: string;
}

const formatLikeLabel = (count: number) =>
  `${count} ${count === 1 ? "Like" : "Likes"}`;

export function BlogLikeButton({
  initialHasLiked = false,
  initialLikesCount,
  slug,
}: BlogLikeButtonProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      setHasLiked(false);
      setLikesCount(initialLikesCount);
      return;
    }

    let isMounted = true;

    getBlogPostLikeState(slug)
      .then((state) => {
        if (!isMounted) return;
        setHasLiked(state.liked);
        setLikesCount(state.likes_count);
      })
      .catch(() => {
        if (!isMounted) return;
        setHasLiked(initialHasLiked);
        setLikesCount(initialLikesCount);
      });

    return () => {
      isMounted = false;
    };
  }, [initialHasLiked, initialLikesCount, isAuthenticated, isAuthLoading, slug]);

  const handleToggleLike = async () => {
    if (isAuthLoading || isPending) return;

    if (!isAuthenticated) {
      showToast("Please log in to save stories.", "error");
      return;
    }

    const previousLiked = hasLiked;
    const previousCount = likesCount;
    const optimisticLiked = !previousLiked;

    setIsPending(true);
    setHasLiked(optimisticLiked);
    setLikesCount((current) =>
      Math.max(0, current + (optimisticLiked ? 1 : -1)),
    );

    try {
      const result = await toggleBlogLike(slug);
      setHasLiked(result.liked);
      setLikesCount(result.likes_count);
      showToast(
        result.liked
          ? "Story saved to your account."
          : "Story removed from saved stories.",
        "success",
      );
    } catch (error) {
      setHasLiked(previousLiked);
      setLikesCount(previousCount);
      showToast(
        normalizeAuthErrorMessage(
          error,
          "Could not update your saved stories. Please try again.",
        ),
        "error",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      disabled={isAuthLoading || isPending}
      aria-pressed={hasLiked}
      className={[
        "mb-8 flex items-center gap-3 rounded-full border px-8 py-4 text-lg font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70",
        hasLiked
          ? "border-red-500/50 bg-red-500/20 text-red-500"
          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white",
      ].join(" ")}
    >
      {hasLiked ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
      <span>{isPending ? "Updating..." : formatLikeLabel(likesCount)}</span>
    </button>
  );
}
