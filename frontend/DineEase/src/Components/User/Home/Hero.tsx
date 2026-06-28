import { useNavigate } from "react-router-dom";
import { Container } from "../../common/ui/Container";
import { Button } from "../../common/ui/Button";
import { brand, heroImages } from "../../../config/brand";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative overflow-hidden bg-brand-cream">
      {/* Decorative background image with cream fade */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url("${heroImages.hero}")` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/40 via-brand-cream/70 to-brand-cream" aria-hidden="true" />

      <Container className="relative flex flex-col items-center py-20 text-center sm:py-28">
        <p className="mb-4 inline-flex items-center rounded-full border border-brand-terracotta/40 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-terracotta">
          Since {brand.sinceYear}
        </p>
        <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-brand-maroon sm:text-6xl">
          {brand.heroHeadline}
        </h1>
        <p className="mt-6 max-w-xl text-base text-brand-ink-soft sm:text-lg">{brand.heroSubtext}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate("/store")}>
            Shop the Collection
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/menu")}>
            Browse Pickles
          </Button>
        </div>

        {/* Trust strip */}
        <div className="mt-14 grid w-full max-w-2xl grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {[
            { k: "100%", v: "Natural" },
            { k: "Sun", v: "Cured" },
            { k: "PAN", v: "India Delivery" },
            { k: "No", v: "Preservatives" },
          ].map((s) => (
            <div key={s.v} className="rounded-xl border border-brand-cream-dark bg-white/70 px-3 py-4">
              <p className="font-serif text-2xl font-bold text-brand-maroon">{s.k}</p>
              <p className="text-xs uppercase tracking-wide text-brand-ink-soft">{s.v}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
