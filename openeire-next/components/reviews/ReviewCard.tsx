import { FaUserCircle } from "react-icons/fa";
import { StarRating } from "@/components/reviews/StarRating";
import type { DisplayReview } from "@/types/reviews";

interface ReviewCardProps {
  review: DisplayReview;
}

const formatReviewDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export function ReviewCard({ review }: ReviewCardProps) {
  const createdAt = formatReviewDate(review.created_at);

  return (
    <article className="mb-6 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-black text-gray-400">
            <FaUserCircle className="text-2xl" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-words text-sm font-bold text-white">
                {review.user}
              </p>
              {review.isPending ? (
                <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">
                  Pending approval
                </span>
              ) : null}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="origin-left scale-75">
                <StarRating rating={review.rating} readOnly />
              </div>
            </div>
          </div>
        </div>
        {createdAt ? (
          <p className="max-w-full break-words pr-1 text-[11px] font-medium uppercase tracking-wider text-gray-500 sm:pl-4 sm:text-right sm:text-xs">
            {createdAt}
          </p>
        ) : null}
      </div>

      {review.comment ? (
        <p className="pl-0 font-sans text-sm leading-relaxed text-gray-300 sm:pl-14">
          &quot;{review.comment}&quot;
        </p>
      ) : null}

      {review.admin_reply ? (
        <div className="mt-6 rounded-r-lg border-l-2 border-accent bg-black/40 p-4 sm:ml-14">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">
              Official Response
            </span>
          </div>
          <p className="text-xs italic leading-relaxed text-gray-400">
            {review.admin_reply}
          </p>
        </div>
      ) : null}
    </article>
  );
}
