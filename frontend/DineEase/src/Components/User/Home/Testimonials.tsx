import { Container } from "../../common/ui/Container";
import { SectionHeading } from "../../common/ui/SectionHeading";
import { Card } from "../../common/ui/Card";
import { Rating } from "../../common/ui/Rating";

// Placeholder testimonials — replace with real customer reviews.
const testimonials = [
  {
    name: "Ananya R.",
    location: "Mumbai",
    rating: 5,
    quote:
      "Tastes exactly like the achaar my grandmother used to make. The mango pickle is unbelievably fresh.",
  },
  {
    name: "Vikram S.",
    location: "Delhi",
    rating: 5,
    quote:
      "You can tell it's made with real mustard oil and care. Packaging is lovely and delivery was quick.",
  },
  {
    name: "Meera K.",
    location: "Bengaluru",
    rating: 4,
    quote:
      "The chilli pickle has the perfect kick. Became a staple in our home within a week!",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <Container>
        <SectionHeading eyebrow="Loved Across India" title="What our customers say" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col p-7">
              <span className="font-serif text-5xl leading-none text-brand-turmeric">&ldquo;</span>
              <p className="mt-2 flex-1 text-brand-ink-soft">{t.quote}</p>
              <Rating value={t.rating} className="mt-5" />
              <div className="mt-3">
                <p className="font-semibold text-brand-ink">{t.name}</p>
                <p className="text-sm text-brand-ink-soft">{t.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
