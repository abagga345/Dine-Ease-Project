import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft, Leaf } from "lucide-react";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import Loader from "../../common/Loader";
import { Review } from "./Review";
import { Container } from "../../common/ui/Container";
import { Badge } from "../../common/ui/Badge";
import { Button } from "../../common/ui/Button";
import { QuantityStepper } from "../../common/ui/QuantityStepper";
import { useCart } from "../../common/useCart";
import { apiUrl } from "../../../config/api";

interface MenuItem1 {
  id: number;
  title: string;
  description: string;
  amount: number;
  imageUrl: string;
  visibility: boolean;
  storeId: string;
}

export function MenuItem() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <Item />
      <Review />
      <Footer />
    </div>
  );
}

function Item() {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MenuItem1>({
    id: 0,
    imageUrl: "",
    description: "",
    visibility: false,
    storeId: "",
    amount: 0,
    title: "",
  });
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { getQuantity, increment, decrement, addToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const store = localStorage.getItem("storeId");
        if (!store) {
          navigate("/store");
          return;
        }
        const res = await fetch(apiUrl(`user/viewmenuitem?itemId=${itemId}`));
        const data = await res.json();
        setItem({
          id: data.id,
          imageUrl: data.imageUrl,
          description: data.description,
          visibility: data.visibility,
          amount: data.amount,
          storeId: data.storeId,
          title: data.title,
        });
      } catch (error) {
        console.error("Failed to fetch item", error);
        toast.error("Failed to fetch menu item");
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <Container className="py-16">
        <Loader />
      </Container>
    );
  }

  const quantity = getQuantity(item.id);

  return (
    <Container className="py-10">
      <button
        onClick={() => navigate("/menu")}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-ink-soft transition hover:text-brand-maroon"
      >
        <ChevronLeft size={16} /> Back to all pickles
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-cream-dark bg-white shadow-card">
          <img src={item.imageUrl} alt={item.title} className="h-full max-h-[32rem] w-full object-cover" />
          {!item.visibility && (
            <span className="absolute left-4 top-4">
              <Badge tone="danger">Sold out</Badge>
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Badge tone="muted" className="w-fit">
            <Leaf size={13} className="mr-1" /> 100% Natural
          </Badge>
          <h1 className="mt-4 font-serif text-3xl font-bold text-brand-maroon sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 text-brand-ink-soft">{item.description}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-brand-maroon">₹{item.amount}</span>
            <span className="text-sm text-brand-ink-soft">incl. of all taxes</span>
          </div>

          <div className="mt-8 flex items-center gap-4">
            {item.visibility ? (
              <>
                <QuantityStepper
                  quantity={quantity}
                  onIncrement={() => increment(item.id)}
                  onDecrement={() => decrement(item.id)}
                  onAdd={() => addToCart(item.id)}
                />
                <Button variant="outline" onClick={() => navigate("/checkout")}>
                  Go to Checkout
                </Button>
              </>
            ) : (
              <span className="font-semibold text-red-500">Currently out of stock</span>
            )}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-brand-cream-dark pt-6 text-center text-xs text-brand-ink-soft">
            <div>
              <p className="font-semibold text-brand-ink">No Preservatives</p>
            </div>
            <div>
              <p className="font-semibold text-brand-ink">Sun-Cured</p>
            </div>
            <div>
              <p className="font-semibold text-brand-ink">PAN-India Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
