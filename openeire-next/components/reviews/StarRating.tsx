"use client";

import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  name?: string;
}

const STARS = [1, 2, 3, 4, 5] as const;

export function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 25,
  name = "rating",
}: StarRatingProps) {
  if (readOnly) {
    return (
      <div
        className="flex justify-center md:justify-start"
        aria-label={`${rating} out of 5 stars`}
      >
        {STARS.map((value) => (
          <FaStar
            key={value}
            aria-hidden="true"
            color={value <= rating ? "#ffc107" : "#e4e5e9"}
            size={size}
          />
        ))}
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="sr-only">Select a star rating</legend>
      <div className="flex justify-center md:justify-start">
        {STARS.map((value) => (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={value}
              checked={rating === value}
              onChange={() => onRatingChange?.(value)}
              className="sr-only"
            />
            <span className="star block transition-colors duration-200">
              <FaStar
                aria-hidden="true"
                color={value <= rating ? "#ffc107" : "#e4e5e9"}
                size={size}
              />
            </span>
            <span className="sr-only">{value} out of 5 stars</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
