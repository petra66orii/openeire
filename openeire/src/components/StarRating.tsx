import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number; // Current rating value (1-5)
  onRatingChange: (rating: number) => void; // Callback for when rating changes
  readOnly?: boolean; // If true, only displays rating, no interaction
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
}) => {
  const stars = [...Array(5)].map((_, index) => {
    const currentRating = index + 1;
    return (
      <label key={index}>
        <input
          type="radio"
          name="rating"
          value={currentRating}
          onClick={() => !readOnly && onRatingChange(currentRating)}
          className="hidden" // Hide default radio button
          disabled={readOnly}
        />
        <span className="star cursor-pointer transition-colors duration-200">
          <FaStar
            color={currentRating <= rating ? "#ffc107" : "#e4e5e9"} // Gold for selected, grey for unselected
            size={25}
          />
        </span>
      </label>
    );
  });

  return <div className="flex justify-center md:justify-start">{stars}</div>;
};

export default StarRating;
