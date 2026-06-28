import { cn } from "./cn";

/** Cream/white surface with heritage border + soft shadow. */
export function Card({
  children,
  className,
  hoverable = false,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-cream-dark bg-white shadow-card",
        hoverable && "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
