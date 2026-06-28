import { useState } from "react";
import { Leaf, Sun, Truck } from "lucide-react";
import { Container } from "../../common/ui/Container";
import { cn } from "../../common/ui/cn";

const items = [
  {
    icon: Leaf,
    title: "Pure & Natural Ingredients",
    description:
      "Hand-picked produce, cold-pressed mustard oil and stone-ground spices — no artificial colours or preservatives, ever.",
    // Bowl of colourful pickled vegetables with spices.
    image:
      "https://images.pexels.com/photos/20085554/pexels-photo-20085554.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    icon: Sun,
    title: "Sun-Cured the Old Way",
    description:
      "Each batch is matured under the sun in traditional martabans, the way our grandmothers did, for a deeper, richer flavour.",
    // Traditional mango pickle jar with a brown lid.
    image:
      "https://images.pexels.com/photos/35267279/pexels-photo-35267279.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    icon: Truck,
    title: "Fresh to Your Doorstep",
    description:
      "Sealed at the peak of freshness and delivered across India, so every jar reaches you tasting just-made.",
    // Jar of spicy homemade pickles, sealed and ready.
    image:
      "https://images.pexels.com/photos/5410417/pexels-photo-5410417.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

export default function Features() {
  const [selected, setSelected] = useState(0);
  const active = items[selected];

  return (
    <section id="features" className="bg-white py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              Why Choose Us
            </p>
            <h2 className="font-serif text-3xl font-bold text-brand-maroon sm:text-4xl">
              Tradition you can taste
            </h2>
            <div className="brand-rule ml-0 mt-4" />

            <div className="mt-8 space-y-3">
              {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = selected === index;
                return (
                  <button
                    key={item.title}
                    onClick={() => setSelected(index)}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition",
                      isActive
                        ? "border-brand-maroon bg-brand-cream shadow-soft"
                        : "border-brand-cream-dark bg-white hover:border-brand-turmeric"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full",
                        isActive ? "bg-brand-maroon text-brand-cream" : "bg-brand-cream text-brand-terracotta"
                      )}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-semibold text-brand-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-brand-ink-soft">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="order-first overflow-hidden rounded-3xl shadow-card lg:order-last">
            <img
              key={active.image}
              src={active.image}
              alt={active.title}
              className="h-72 w-full animate-fade-in-up object-cover sm:h-[28rem]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
