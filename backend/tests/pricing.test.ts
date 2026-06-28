import { describe, it, expect } from "vitest";
import { computeOrderTotal } from "../src/utils/pricing";

const config = { shipping: 65, cod: 40, taxRate: 12, paymentMethod: "UPI" };

describe("computeOrderTotal", () => {
  it("computes subtotal + shipping + tax for a UPI order", () => {
    // subtotal = 100*2 = 200; base = 200+65 = 265; tax = round(265*0.12)=32; total=297
    const total = computeOrderTotal([{ amount: 100, quantity: 2 }], config);
    expect(total).toBe(297);
  });

  it("adds the COD charge only for COD orders", () => {
    const upi = computeOrderTotal([{ amount: 100, quantity: 1 }], { ...config, paymentMethod: "UPI" });
    const cod = computeOrderTotal([{ amount: 100, quantity: 1 }], { ...config, paymentMethod: "COD" });
    // UPI: base=165, tax=round(19.8)=20, total=185
    expect(upi).toBe(185);
    // COD: base=100+65+40=205, tax=round(24.6)=25, total=230
    expect(cod).toBe(230);
  });

  it("sums multiple line items", () => {
    const total = computeOrderTotal(
      [
        { amount: 50, quantity: 3 }, // 150
        { amount: 120, quantity: 1 }, // 120
      ],
      config
    );
    // subtotal=270; base=335; tax=round(40.2)=40; total=375
    expect(total).toBe(375);
  });

  it("handles an empty cart (only shipping + tax)", () => {
    const total = computeOrderTotal([], config);
    // base=65; tax=round(7.8)=8; total=73
    expect(total).toBe(73);
  });

  it("treats a zero tax rate correctly", () => {
    const total = computeOrderTotal([{ amount: 100, quantity: 1 }], { ...config, taxRate: 0 });
    expect(total).toBe(165);
  });
});
