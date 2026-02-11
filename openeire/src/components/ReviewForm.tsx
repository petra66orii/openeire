import React, { useState } from "react";
import { submitProductReview } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface ReviewFormProps {
  productType: string;
  productId: string;
  onReviewSubmitted: () => void;
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
      toast.error("Please tap a star to rate.");
      return;
    }

    setLoading(true);
    try {
      await submitProductReview(productType, productId, { rating, comment });
      toast.success("Review submitted! It will appear after approval.");
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (error: any) {
      const errorMessage = error?.detail || "Failed to submit review.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 border-dashed">
        <p className="text-gray-400 mb-4 font-sans">
          Please log in to share your thoughts on this piece.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full transition-all"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 bg-white/5 rounded-2xl border border-white/5 mb-8"
    >
      <h3 className="text-xl font-serif font-bold text-white mb-6">
        Leave a Review
      </h3>

      {/* Rating Input */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
          Your Rating <span className="text-accent">*</span>
        </label>
        <div className="flex items-center gap-4">
          <StarRating rating={rating} onRatingChange={setRating} />
          {rating > 0 && (
            <span className="text-accent text-sm font-bold">{rating} / 5</span>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <label
          htmlFor="comment"
          className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold"
        >
          Your Experience (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none text-sm"
          placeholder="What did you think of the quality, lighting, or print?"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="px-8 py-3 bg-brand-500 hover:bg-brand-700 text-paper font-bold rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
