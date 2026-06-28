import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { QuantityStepper } from "./ui/QuantityStepper";
import { useCart } from "./useCart";

export interface Product {
  id: number;
  title: string;
  description: string;
  amount: number;
  imageUrl: string;
  visibility: boolean;
}

function shortDescription(description: string, wordLimit = 12) {
  const words = description.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "…" : description;
}

/** Heritage product card used on the storefront grid and the home page. */
export function ProductCard({ item }: { item: Product }) {
  const navigate = useNavigate();
  const { getQuantity, increment, decrement, addToCart } = useCart();
  const quantity = getQuantity(item.id);

  return (
    <Card hoverable className="flex flex-col overflow-hidden">
      <button
        onClick={() => navigate(`/menuitem/${item.id}`)}
        className="relative block aspect-square w-full overflow-hidden bg-brand-cream"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {!item.visibility && (
          <span className="absolute left-3 top-3">
            <Badge tone="danger">Sold out</Badge>
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold text-brand-ink">{item.title}</h3>
        <p className="mt-1 flex-1 text-sm text-brand-ink-soft">{shortDescription(item.description)}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-serif text-xl font-bold text-brand-maroon">₹{item.amount}</span>
          {item.visibility ? (
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
              onAdd={() => addToCart(item.id)}
              size="sm"
            />
          ) : (
            <span className="text-sm font-semibold text-red-500">Unavailable</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="mt-3"
          onClick={() => navigate(`/menuitem/${item.id}`)}
        >
          View details
        </Button>
      </div>
    </Card>
  );
}
