import { useState } from "react";

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            color:
              star <= (hover || value)
                ? "#FFD700"
                : "#d3d3d3",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;