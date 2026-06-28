import { forwardRef } from "react";
import { cn } from "./cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const fieldBase =
  "w-full rounded-lg border border-brand-cream-dark bg-white px-4 py-2.5 text-sm text-brand-ink shadow-sm outline-none transition focus:border-brand-maroon focus:ring-2 focus:ring-brand-turmeric/40 placeholder:text-brand-ink-soft/60";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, icon, className, id, ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-brand-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-brand-ink-soft">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(fieldBase, icon ? "pl-10" : "", error ? "border-red-400 focus:border-red-500" : "", className)}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});
