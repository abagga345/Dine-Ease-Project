import { cn } from "./cn";

/**
 * Selectable card backed by a hidden radio input (the `peer-checked` pattern).
 * Spread `register(...)` (react-hook-form) or standard props onto `inputProps`.
 */
export function RadioCard({
  id,
  value,
  name,
  inputProps,
  defaultChecked,
  children,
  className,
}: {
  id: string;
  value: string | number;
  name?: string;
  inputProps?: Record<string, unknown>;
  defaultChecked?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <input
        className="peer sr-only"
        id={id}
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        {...inputProps}
      />
      <span className="pointer-events-none absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-[6px] border-brand-cream-dark bg-white peer-checked:border-brand-maroon" />
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none rounded-xl border border-brand-cream-dark bg-white p-4 pr-12 transition peer-checked:border-brand-maroon peer-checked:bg-brand-cream",
          className
        )}
      >
        {children}
      </label>
    </div>
  );
}
