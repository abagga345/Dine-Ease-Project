import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import axios from "axios";
import { Drawer } from "../../common/ui/Drawer";
import { Button } from "../../common/ui/Button";
import { QuantityStepper } from "../../common/ui/QuantityStepper";
import { useCart } from "../../common/useCart";
import { apiUrl } from "../../../config/api";

interface LineItem {
  id: number;
  title: string;
  imageUrl: string;
  amount: number;
}

/** Slide-over cart. Reads the localStorage cart and hydrates item details. */
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, increment, decrement, getQuantity, totalItems } = useCart();
  const [details, setDetails] = useState<Record<number, LineItem>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hydrate details for any cart ids we don't yet know about (only while open).
  useEffect(() => {
    if (!open) return;
    const missing = Object.keys(cart)
      .map(Number)
      .filter((id) => !details[id]);
    if (missing.length === 0) return;

    setLoading(true);
    Promise.all(
      missing.map((id) =>
        axios
          .get(apiUrl(`user/viewmenuitem?itemId=${id}`))
          .then((r) => r.data as LineItem)
          .catch(() => null)
      )
    )
      .then((items) => {
        setDetails((prev) => {
          const next = { ...prev };
          items.forEach((it) => {
            if (it) next[it.id] = it;
          });
          return next;
        });
      })
      .finally(() => setLoading(false));
  }, [open, cart]);

  const ids = Object.keys(cart).map(Number);
  const subtotal = ids.reduce((sum, id) => sum + (details[id]?.amount || 0) * cart[id], 0);

  const goCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Your Cart${totalItems ? ` (${totalItems})` : ""}`}
      footer={
        ids.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between text-brand-ink">
              <span className="font-medium">Subtotal</span>
              <span className="text-lg font-bold text-brand-maroon">₹{subtotal}</span>
            </div>
            <Button fullWidth onClick={goCheckout}>
              Proceed to Checkout
            </Button>
            <p className="mt-2 text-center text-xs text-brand-ink-soft">
              Shipping &amp; taxes calculated at checkout
            </p>
          </div>
        ) : undefined
      }
    >
      {ids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-brand-ink-soft">
          <ShoppingBag size={48} className="mb-4 text-brand-cream-dark" />
          <p className="font-medium">Your cart is empty</p>
          <Button variant="ghost" className="mt-4" onClick={() => { onClose(); navigate("/menu"); }}>
            Browse pickles
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {ids.map((id) => {
            const item = details[id];
            return (
              <li key={id} className="flex gap-3 rounded-xl border border-brand-cream-dark bg-white p-3">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                  {item?.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-semibold text-brand-ink">{item?.title || (loading ? "Loading…" : `Item #${id}`)}</p>
                    {item && <p className="text-sm text-brand-ink-soft">₹{item.amount}</p>}
                  </div>
                  <QuantityStepper
                    quantity={getQuantity(id)}
                    onIncrement={() => increment(id)}
                    onDecrement={() => decrement(id)}
                    onAdd={() => increment(id)}
                    size="sm"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
