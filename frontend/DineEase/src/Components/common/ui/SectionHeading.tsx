import { cn } from "./cn";

/** Eyebrow + serif title + optional subtitle, used to head marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold text-brand-maroon sm:text-4xl">{title}</h2>
      {align === "center" && <div className="brand-rule mt-4" />}
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-brand-ink-soft",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
