import { cn } from "./cn";

type Tone = "maroon" | "turmeric" | "terracotta" | "muted" | "danger";

const tones: Record<Tone, string> = {
  maroon: "bg-brand-maroon text-brand-cream",
  turmeric: "bg-brand-turmeric text-brand-ink",
  terracotta: "bg-brand-terracotta text-white",
  muted: "bg-brand-cream-dark text-brand-ink-soft",
  danger: "bg-red-100 text-red-700",
};

export function Badge({
  children,
  tone = "turmeric",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
