"use client";

import { useState } from "react";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { getProductReviews } from "@/lib/api/reviews";
import type {
  DisplayReview,
  ProductReview,
  ReviewProductType,
} from "@/types/reviews";

interface ProductReviewsProps {
  productType: ReviewProductType;
  productId: string | number;
  initialReviews: ProductReview[];
  initialLoadError?: boolean;
}

const asPendingReview = (
  review: ProductReview | null,
  fallbackId: number,
): DisplayReview => ({
  id: review?.id ?? `local-${fallbackId}`,
  user: review?.user ?? "You",
  rating: review?.rating ?? 0,
  comment: review?.comment ?? "",
  created_at: review?.created_at ?? new Date().toISOString(),
  admin_reply: null,
  isPending: true,
});

export function ProductReviews({
  productType,
  productId,
  initialReviews,
  initialLoadError = false,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [pendingReviews, setPendingReviews] = useState<DisplayReview[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(
    initialLoadError ? "Failed to load reviews." : null,
  );

  const handleReviewSubmitted = async (review: ProductReview | null) => {
    setPendingReviews((current) => [
      asPendingReview(review, Date.now()),
      ...current,
    ]);
    setIsRefreshing(true);
    setLoadError(null);

    try {
      const approvedReviews = await getProductReviews(productType, productId);
      setReviews(approvedReviews);
    } catch {
      setLoadError("Review submitted, but we could not refresh reviews.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="mt-20 border-t border-white/10 pt-12" id="reviews">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-white">
          Customer Reviews ({reviews.length + pendingReviews.length})
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
          Reviews are moderated before they appear publicly.
        </p>
      </div>

      <ReviewForm
        productType={productType}
        productId={productId}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <ReviewList
        reviews={reviews}
        pendingReviews={pendingReviews}
        isLoading={isRefreshing && !reviews.length && !pendingReviews.length}
        error={loadError}
      />
    </section>
  );
}
