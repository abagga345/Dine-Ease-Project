import { useCallback, useEffect, useState } from "react";

// Cart is stored in localStorage under "cart" as { [itemId]: quantity }.
export type Cart = { [key: number]: number };

const KEY = "cart";

function read(): Cart {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Cart) : {};
  } catch {
    return {};
  }
}

/**
 * Centralized cart state backed by localStorage. Replaces the duplicated
 * cart helpers in menu.tsx and MenuItem.tsx. Syncs across components/tabs via
 * the "storage" event and a custom "cart-updated" event.
 */
export function useCart() {
  const [cart, setCart] = useState<Cart>(read);

  useEffect(() => {
    const sync = () => setCart(read());
    window.addEventListener("storage", sync);
    window.addEventListener("cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart-updated", sync);
    };
  }, []);

  const persist = useCallback((next: Cart) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setCart(next);
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  const updateCart = useCallback(
    (itemId: number, change: number) => {
      const next = { ...read() };
      const q = Math.max(0, (next[itemId] || 0) + change);
      if (q === 0) delete next[itemId];
      else next[itemId] = q;
      persist(next);
    },
    [persist]
  );

  const increment = useCallback((id: number) => updateCart(id, 1), [updateCart]);
  const decrement = useCallback((id: number) => updateCart(id, -1), [updateCart]);
  const addToCart = useCallback((id: number) => updateCart(id, 1), [updateCart]);
  const getQuantity = useCallback((id: number) => cart[id] || 0, [cart]);
  const clear = useCallback(() => persist({}), [persist]);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return { cart, updateCart, increment, decrement, addToCart, getQuantity, clear, totalItems };
}
