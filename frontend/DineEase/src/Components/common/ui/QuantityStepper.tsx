import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "./Button";

/**
 * Add-to-cart control: shows an "Add" button at qty 0, else a −/+ stepper.
 * Presentational — the parent owns the quantity + handlers (see useCart).
 */
export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  onAdd,
  size = "md",
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAdd: () => void;
  size?: "sm" | "md";
}) {
  if (quantity <= 0) {
    return (
      <Button size={size === "sm" ? "sm" : "md"} onClick={onAdd}>
        <ShoppingCart size={16} />
        Add
      </Button>
    );
  }

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full bg-brand-maroon text-brand-cream transition hover:bg-brand-maroon-dark";

  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Decrease" className={btn} onClick={onDecrement}>
        <Minus size={16} />
      </button>
      <span className="w-6 text-center text-lg font-semibold text-brand-ink">{quantity}</span>
      <button type="button" aria-label="Increase" className={btn} onClick={onIncrement}>
        <Plus size={16} />
      </button>
    </div>
  );
}
