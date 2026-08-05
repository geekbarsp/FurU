import { Star, StarHalf } from "lucide-react";
export default function PersonStars({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="person-stars" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) =>
        i < full ? (
          <Star key={i} size={size} fill="currentColor" />
        ) : i === full && half ? (
          <StarHalf key={i} size={size} fill="currentColor" />
        ) : (
          <Star key={i} size={size} />
        ),
      )}
    </span>
  );
}
