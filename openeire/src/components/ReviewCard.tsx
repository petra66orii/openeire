// src/components/ReviewCard.tsx

import React from "react";
import { ProductReview } from "../services/api";
import StarRating from "./StarRating"; // Re-use the StarRating component for display

interface ReviewCardProps {
  review: ProductReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const createdAt = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-gray-800">{review.user}</p>
          <StarRating
            rating={review.rating}
            onRatingChange={() => {}}
            readOnly={true}
          />{" "}
          {/* Read-only display */}
        </div>
        <p className="text-sm text-gray-500">{createdAt}</p>
      </div>
      {review.comment && (
        <p className="text-gray-700 text-sm md:text-base mt-2">
          {review.comment}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
