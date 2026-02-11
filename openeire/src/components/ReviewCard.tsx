import React from "react";
import { ProductReview } from "../services/api";
import StarRating from "./StarRating";
import { FaUserCircle } from "react-icons/fa";

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
    <div className="bg-white/5 p-6 rounded-xl border border-white/5 mb-6 backdrop-blur-sm transition-colors hover:bg-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* User Icon Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-gray-400">
            <FaUserCircle className="text-2xl" />
          </div>

          <div>
            <p className="font-bold text-white text-sm">{review.user}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="scale-75 origin-left">
                <StarRating
                  rating={review.rating}
                  onRatingChange={() => {}}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {createdAt}
        </p>
      </div>

      {review.comment && (
        <p className="text-gray-300 text-sm leading-relaxed font-sans pl-14">
          "{review.comment}"
        </p>
      )}

      {/* Admin Reply Section */}
      {review.admin_reply && (
        <div className="mt-6 ml-14 p-4 bg-black/40 border-l-2 border-accent rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest border border-accent/30 px-2 py-0.5 rounded-full">
              Official Response
            </span>
          </div>
          <p className="text-gray-400 text-xs italic leading-relaxed">
            {review.admin_reply}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
