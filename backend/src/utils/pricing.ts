// Pure order-total math, extracted so it can be unit-tested in isolation and
// kept in sync with the frontend's checkout calculation.

export interface PriceLine {
  amount: number; // unit price
  quantity: number;
}

export interface PricingConfig {
  shipping: number;
  cod: number;
  taxRate: number; // percentage, e.g. 12 means 12%
  paymentMethod: string;
}

/**
 * Compute the authoritative order total:
 *   subtotal = Σ(amount * quantity)
 *   base     = subtotal + shipping + (COD ? cod : 0)
 *   tax      = round(base * taxRate/100)
 *   total    = base + tax
 *
 * This mirrors the frontend (Checkout.tsx) exactly so the client-sent amount
 * matches the server-computed amount.
 */
export function computeOrderTotal(lines: PriceLine[], config: PricingConfig): number {
  const subtotal = lines.reduce((sum, l) => sum + l.amount * l.quantity, 0);
  const base = subtotal + config.shipping + (config.paymentMethod === "COD" ? config.cod : 0);
  const tax = Math.round(base * (config.taxRate / 100));
  return base + tax;
}
