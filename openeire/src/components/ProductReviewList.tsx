import React, { useState, useEffect } from "react";
import { getProductReviews, ProductReview } from "../services/api";
import ReviewCard from "./ReviewCard"; // Import ReviewCard

interface ProductReviewListProps {
  productType: string;
  productId: string;
  refreshKey: number; // A prop to trigger re-fetch when reviews are submitted
}

const ProductReviewList: React.FC<ProductReviewListProps> = ({
  productType,
  productId,
  refreshKey,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductReviews(productType, productId);
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productType, productId, refreshKey]); // Re-fetch when product or refreshKey changes

  if (loading)
    return <div className="text-center text-gray-500">Loading reviews...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Reviews ({reviews.length})
      </h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews yet. Be the first to leave one!
        </p>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviewList;
