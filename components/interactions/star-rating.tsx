"use client";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
  label?: string;
};

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "sm",
  label,
}: Props) {
  const starSize = size === "md" ? "text-lg" : "text-sm";
  const interactive = !readOnly && onChange;

  return (
    <div
      className={`nemi-stars inline-flex items-center gap-0.5 ${starSize}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={label ?? `${value} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              className={`nemi-star-btn ${star <= value ? "is-active" : ""}`}
              onClick={() => onChange?.(star)}
            >
              ★
            </button>
          );
        }

        return (
          <span
            key={star}
            className={filled ? "nemi-star is-active" : "nemi-star"}
            aria-hidden
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
