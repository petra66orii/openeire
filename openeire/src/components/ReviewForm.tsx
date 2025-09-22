// src/components/ReviewForm.tsx

import React, { useState } from "react";
import { submitProductReview } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";
import { toast } from "react-toastify";

interface ReviewFormProps {
  productType: string;
  productId: string;
  onReviewSubmitted: () => void; // Callback to refresh reviews on the page
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productType,
  productId,
  onReviewSubmitted,
}) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    setLoading(true);
    try {
      await submitProductReview(productType, productId, { rating, comment });
      toast.success("Review submitted! It will appear after approval.");
      setRating(0); // Reset form
      setComment(""); // Reset form
      onReviewSubmitted(); // Trigger parent to refresh reviews
    } catch (error: any) {
      // Handle backend validation errors or other network issues
      const errorMessage =
        error?.detail ||
        error?.non_field_errors?.[0] ||
        "Failed to submit review.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="text-center text-gray-500">
        Please log in to leave a review.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Leave a Review
      </h3>

      <div>
        <label
          htmlFor="rating"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating rating={rating} onRatingChange={setRating} />
        {rating === 0 && (
          <p className="text-red-500 text-xs mt-1">Rating is required.</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Your Comment (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="What did you think of this product?"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
