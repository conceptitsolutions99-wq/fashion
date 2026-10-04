export default function RatingStars({
  rating,
  reviews,
  className = "",
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 ${i <= rounded ? "text-brand-500" : "text-ink-200"}`}
            fill="currentColor"
          >
            <path d="m12 17.3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9L12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2z" />
          </svg>
        ))}
      </span>
      <span className="text-xs text-ink-500">
        {rating.toFixed(1)}
        {typeof reviews === "number" && <span className="text-ink-400"> ({reviews})</span>}
      </span>
      <span className="sr-only">
        Rated {rating} out of 5{typeof reviews === "number" ? ` from ${reviews} reviews` : ""}
      </span>
    </span>
  );
}
