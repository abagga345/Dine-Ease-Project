import { useNavigate } from "react-router-dom";
import { Container } from "../../common/ui/Container";
import { SectionHeading } from "../../common/ui/SectionHeading";
import { heroImages } from "../../../config/brand";

/** Category tiles ("Our Range"). Placeholder categories — wire to filters later. */
export default function Collections() {
  const navigate = useNavigate();

  return (
    <section id="collections" className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Our Exciting Range"
          subtitle="From fiery mango to sweet murabba — find a jar for every plate."
        />

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {heroImages.collections.map((c) => (
            <button
              key={c.title}
              onClick={() => navigate("/store")}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/80 via-brand-maroon-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <p className="font-serif text-lg font-bold text-brand-cream">{c.title}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-turmeric opacity-0 transition group-hover:opacity-100">
                  Shop now →
                </p>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
