import { useNavigate } from "react-router-dom";
import { Container } from "../../common/ui/Container";
import { Button } from "../../common/ui/Button";
import { brand, heroImages } from "../../../config/brand";

/** Two-column heritage/about story block. Copy comes from brand.ts (placeholder). */
export default function HeritageStory() {
  const navigate = useNavigate();

  return (
    <section id="story" className="bg-brand-cream py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-card">
              <img
                src={heroImages.story}
                alt="Our heritage"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-brand-maroon px-6 py-4 text-brand-cream shadow-card-hover sm:block">
              <p className="font-serif text-3xl font-bold">{brand.sinceYear}</p>
              <p className="text-xs uppercase tracking-widest text-brand-turmeric">Est.</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              {brand.story.eyebrow}
            </p>
            <h2 className="font-serif text-3xl font-bold text-brand-maroon sm:text-4xl">
              {brand.story.title}
            </h2>
            <div className="brand-rule ml-0 mt-4" />
            <p className="mt-6 text-brand-ink-soft">{brand.story.body}</p>
            <p className="mt-4 text-brand-ink-soft">{brand.about}</p>
            <Button className="mt-8" onClick={() => navigate("/store")}>
              Taste the Tradition
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
