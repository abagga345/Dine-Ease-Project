// Lazily inject Razorpay's checkout.js (loaded once) and expose a typed
// `window.Razorpay` for the checkout flow.

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<void> | null = null;

/** Resolve once checkout.js is ready; safe to call repeatedly. */
export function loadRazorpayScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${SCRIPT_SRC}"]`
    ) as HTMLScriptElement | null;

    if (existing) {
      if (window.Razorpay) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => {
        loadPromise = null;
        reject(new Error("Failed to load Razorpay"));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Razorpay"));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}
