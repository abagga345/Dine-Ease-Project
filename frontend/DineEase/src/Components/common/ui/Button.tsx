import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turmeric focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-maroon text-brand-cream hover:bg-brand-maroon-dark shadow-soft hover:shadow-card-hover",
  secondary:
    "bg-brand-turmeric text-brand-ink hover:bg-brand-turmeric-dark shadow-soft",
  outline:
    "border-2 border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream",
  ghost: "text-brand-maroon hover:bg-brand-maroon/10",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
