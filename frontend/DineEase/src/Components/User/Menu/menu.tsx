import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import Loader from "../../common/Loader";
import { Container } from "../../common/ui/Container";
import { Input } from "../../common/ui/Input";
import { Select } from "../../common/ui/Select";
import { ProductCard, Product } from "../../common/ProductCard";
import { apiUrl } from "../../../config/api";

type Sort = "default" | "price-asc" | "price-desc" | "name";

export const Menu = () => {
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const navigate = useNavigate();

  useEffect(() => {
    const store = localStorage.getItem("storeId");
    if (!store) {
      navigate("/store");
      return;
    }
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(apiUrl(`user/viewmenu?storeId=${store}`));
        const data = await res.json();
        setMenuItems(data.items ?? []);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        toast.error("Failed to fetch menu items");
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const visibleItems = useMemo(() => {
    let list = menuItems.filter((i) =>
      i.title.toLowerCase().includes(query.trim().toLowerCase())
    );
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.amount - b.amount);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.amount - a.amount);
        break;
      case "name":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [menuItems, query, sort]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />

      {/* Page banner */}
      <div className="border-b border-brand-cream-dark bg-white">
        <Container className="py-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
            The Pantry
          </p>
          <h1 className="font-serif text-4xl font-bold text-brand-maroon">Our Pickles</h1>
          <div className="brand-rule mt-4" />
        </Container>
      </div>

      <Container className="py-10">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Controls */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:max-w-xs">
                <Input
                  placeholder="Search pickles…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  icon={<Search size={16} />}
                />
              </div>
              <div className="sm:w-52">
                <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A–Z</option>
                </Select>
              </div>
            </div>

            {visibleItems.length === 0 ? (
              <div className="rounded-2xl border border-brand-cream-dark bg-white py-20 text-center text-brand-ink-soft">
                {menuItems.length === 0
                  ? "No pickles available yet. Check back soon!"
                  : "No pickles match your search."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </Container>

      <Footer />
    </div>
  );
};
