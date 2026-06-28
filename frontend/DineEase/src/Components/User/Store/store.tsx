import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import Loader from "../../common/Loader";
import { Container } from "../../common/ui/Container";
import { Button } from "../../common/ui/Button";
import { RadioCard } from "../../common/ui/RadioCard";
import { apiUrl } from "../../../config/api";
import { brand } from "../../../config/brand";

interface storeInterface {
  storeId: string;
  storeStreet: string;
  state: string;
  pincode: string;
}

interface FormData {
  storeId: string;
}

export function Store() {
  const [Stores, setStores] = useState<storeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const Fetchstores = async () => {
      try {
        const response = await fetch(apiUrl("user/allstores"));
        const data = await response.json();
        setStores(data["stores"]);
        const validStoreIds = data["stores"].map((store: storeInterface) => store.storeId);
        const store = localStorage.getItem("storeId");
        if (store && validStoreIds.includes(store)) {
          setValue("storeId", store);
        }
      } catch (error) {
        console.error("Failed to fetch Stores: ", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    Fetchstores();
  }, []);

  const onSubmit = (data: FormData) => {
    localStorage.setItem("storeId", data.storeId.toString());
    localStorage.setItem("cart", "{}");
    window.dispatchEvent(new Event("cart-updated"));
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />

      <div className="border-b border-brand-cream-dark bg-white">
        <Container className="py-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
            Choose a location
          </p>
          <h1 className="font-serif text-4xl font-bold text-brand-maroon">Select Your Store</h1>
          <div className="brand-rule mt-4" />
        </Container>
      </div>

      <Container className="py-10">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Stores.map((store) => (
                <RadioCard
                  key={store.storeId}
                  id={`radio_store_${store.storeId}`}
                  value={store.storeId}
                  inputProps={register("storeId", { required: true })}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-brand-terracotta">
                      <MapPin size={20} />
                    </span>
                    <div>
                      <p className="font-serif text-lg font-bold text-brand-ink">{brand.name}</p>
                      <p className="text-sm text-brand-ink-soft">{store.storeStreet}</p>
                      <p className="text-sm text-brand-ink-soft">{store.state}</p>
                      <p className="text-sm text-brand-ink-soft">Pincode: {store.pincode}</p>
                    </div>
                  </div>
                </RadioCard>
              ))}
            </div>

            <div className="mt-6 text-center">
              {errors.storeId && (
                <p className="mb-2 text-sm text-red-600">Please select a store.</p>
              )}
              <p className="mb-5 text-sm text-brand-ink-soft">
                Note: changing your store will clear any items in your cart.
              </p>
              <Button type="submit" size="lg">
                Continue to Pickles
              </Button>
            </div>
          </form>
        )}
      </Container>

      <Footer />
    </div>
  );
}
