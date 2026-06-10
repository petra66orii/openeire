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
    <div className="mb-6 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {/* User Icon Placeholder */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-black text-gray-400">
            <FaUserCircle className="text-2xl" />
          </div>

          <div className="min-w-0">
            <p className="break-words text-sm font-bold text-white">
              {review.user}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
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
        <p className="max-w-full break-words pr-1 text-[11px] font-medium uppercase tracking-wider text-gray-500 sm:pl-4 sm:text-xs sm:text-right">
          {createdAt}
        </p>
      </div>

      {review.comment && (
        <p className="pl-0 font-sans text-sm leading-relaxed text-gray-300 sm:pl-14">
          "{review.comment}"
        </p>
      )}

      {/* Admin Reply Section */}
      {review.admin_reply && (
        <div className="mt-6 rounded-r-lg border-l-2 border-accent bg-black/40 p-4 sm:ml-14">
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

