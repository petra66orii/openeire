import { ReviewCard } from "@/components/reviews/ReviewCard";
import type { DisplayReview } from "@/types/reviews";

interface ReviewListProps {
  reviews: DisplayReview[];
  pendingReviews?: DisplayReview[];
  isLoading?: boolean;
  error?: string | null;
}

export function ReviewList({
  reviews,
  pendingReviews = [],
  isLoading = false,
  error = null,
}: ReviewListProps) {
  if (isLoading) {
    return <div className="text-center text-gray-500">Loading reviews...</div>;
  }

  const visibleReviews = [...pendingReviews, ...reviews];

  if (!visibleReviews.length) {
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }

    return (
      <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
    );
  }

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {visibleReviews.map((review) => (
        <ReviewCard
          key={`${review.isPending ? "pending" : "approved"}-${review.id}`}
          review={review}
        />
      ))}
    </div>
  );
}
