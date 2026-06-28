import { forwardRef } from "react";
import { cn } from "./cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, className, id, children, ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-brand-ink">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-lg border border-brand-cream-dark bg-white px-4 py-2.5 text-sm text-brand-ink shadow-sm outline-none transition focus:border-brand-maroon focus:ring-2 focus:ring-brand-turmeric/40",
          className
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});
