import { Star } from "lucide-react";
import { cn } from "./cn";

/** Star rating. Pass `onChange` to make it interactive (input), else read-only. */
export function Rating({
  value,
  max = 5,
  size = 18,
  onChange,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
  className?: string;
}) {
  const interactive = typeof onChange === "function";
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        const star = (
          <Star
            size={size}
            className={filled ? "fill-brand-turmeric text-brand-turmeric" : "text-brand-cream-dark"}
          />
        );
        return interactive ? (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${i + 1}`}
            onClick={() => onChange!(i + 1)}
            className="transition hover:scale-110"
          >
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        );
      })}
    </div>
  );
}
