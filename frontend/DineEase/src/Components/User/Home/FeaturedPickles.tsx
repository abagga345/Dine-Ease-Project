import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../common/ui/Container";
import { SectionHeading } from "../../common/ui/SectionHeading";
import { Button } from "../../common/ui/Button";
import { ProductCard, Product } from "../../common/ProductCard";
import { apiUrl } from "../../../config/api";

/** Fetches a handful of real products to feature on the home page. */
export default function FeaturedPickles() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Prefer the user's selected store; otherwise use the first available store.
        let storeId = localStorage.getItem("storeId");
        if (!storeId) {
          const sres = await fetch(apiUrl("user/allstores"));
          const sdata = await sres.json();
          storeId = sdata?.stores?.[0]?.storeId ?? null;
        }
        if (!storeId) return;

        const res = await fetch(apiUrl(`user/viewmenu?storeId=${storeId}`));
        const data = await res.json();
        if (!cancelled) setItems((data.items ?? []).slice(0, 8));
      } catch {
        /* silently skip the featured section if it fails */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="featured" className="bg-brand-cream py-20">
      <Container>
        <SectionHeading
          eyebrow="Handpicked"
          title="Our Special Pickles"
          subtitle="A taste of our most-loved jars — pressed in small batches and sealed for freshness."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border border-brand-cream-dark bg-white/60"
                />
              ))
            : items.map((item) => <ProductCard key={item.id} item={item} />)}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={() => navigate("/store")}>
            View All Pickles
          </Button>
        </div>
      </Container>
    </section>
  );
}
