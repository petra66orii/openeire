"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getReviewErrorMessage,
  submitProductReview,
} from "@/lib/api/reviews";
import type {
  ProductReview,
  ReviewProductType,
  ReviewSubmissionResponse,
} from "@/types/reviews";
import { StarRating } from "@/components/reviews/StarRating";

interface ReviewFormProps {
  productType: ReviewProductType;
  productId: string | number;
  onReviewSubmitted: (review: ProductReview | null) => void;
}

const isProductReview = (
  response: ReviewSubmissionResponse,
): response is ProductReview =>
  Boolean(
    response &&
      typeof response === "object" &&
      "id" in response &&
      "rating" in response &&
      "created_at" in response,
  );

export function ReviewForm({
  productType,
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { isAuthenticated, isLoading, refreshUser } = useAuth();
  const pathname = usePathname();
  const ratingName = useId();
  const commentId = useId();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loginHref = `/login?next=${encodeURIComponent(pathname || "/")}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (rating < 1 || rating > 5) {
      setError("Please tap a star to rate.");
      return;
    }

    setIsSubmitting(true);
    try {
      const activeUser = await refreshUser().catch(() => undefined);
      if (activeUser === null) {
        setError("Your session has expired. Please log in again to review.");
        return;
      }

      const response = await submitProductReview(productType, productId, {
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
      setSuccess("Review submitted! It will appear after approval.");
      onReviewSubmitted(isProductReview(response) ? response : null);
    } catch (submitError) {
      setError(getReviewErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8 rounded-xl border border-white/10 border-dashed bg-white/5 p-8 text-center text-gray-500">
        Checking your sign-in status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mb-8 rounded-xl border border-white/10 border-dashed bg-white/5 p-8 text-center">
        <p className="mb-4 font-sans text-gray-400">
          Please log in to share your thoughts on this piece.
        </p>
        <Link
          href={loginHref}
          className="inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8"
    >
      <h3 className="mb-6 font-serif text-xl font-bold text-white">
        Leave a Review
      </h3>

      <div className="mb-6">
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
          Your Rating <span className="text-accent">*</span>
        </label>
        <div className="flex items-center gap-4">
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            name={ratingName}
          />
          {rating > 0 ? (
            <span className="text-sm font-bold text-accent">{rating} / 5</span>
          ) : null}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor={commentId}
          className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500"
        >
          Your Experience (Optional)
        </label>
        <textarea
          id={commentId}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-white placeholder-gray-600 transition-all focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="What did you think of the quality, lighting, or print?"
        />
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mb-4 rounded-lg border border-brand-500/20 bg-brand-900/40 px-4 py-3 text-sm text-brand-100">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="rounded-lg bg-brand-500 px-8 py-3 font-bold text-paper shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-brand-700"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
