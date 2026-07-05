import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { Container } from "../../common/ui/Container";
import { brand, heroImages } from "../../../config/brand";

const currentYear = new Date().getFullYear();

const stats = [
  { value: `${currentYear - brand.sinceYear}+`, label: "Years of tradition" },
  { value: "9+", label: "Signature varieties" },
  { value: "1950", label: "Est. in Khari Baoli" },
  { value: "100%", label: "Hand-made in Delhi" },
];

const values = [
  {
    title: "Rooted in Heritage",
    body:
      "Every jar carries forward a recipe perfected over generations on the " +
      "spice lanes of Khari Baoli — the same flavour Delhi has loved since 1950.",
  },
  {
    title: "Chosen Spices, Nothing Less",
    body:
      "Hand-picked spices, salt and sugar in careful balance give each variety " +
      "its unique, magical taste — no shortcuts, no artificial flavours.",
  },
  {
    title: "Made in Small Batches",
    body:
      "We still make our pickles the slow way, in small hand-crafted batches, so " +
      "every bite tastes exactly the way tradition intended.",
  },
];

export function AboutUs() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />

      <main>
        {/* ---------------------------------------------------------------- */}
        {/*  Hero                                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImages.hero}
              alt="Traditional homemade pickles"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-maroon-dark/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark/95 via-brand-maroon-dark/40 to-transparent" />
          </div>

          <Container>
            <div className="relative mx-auto max-w-3xl py-24 text-center md:py-32">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-brand-turmeric">
                {brand.story.eyebrow}
              </p>
              <h1 className="font-serif text-4xl font-bold text-brand-cream md:text-6xl">
                About {brand.name}
              </h1>
              <div className="brand-rule mt-6" />
              <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-cream/85">
                {brand.tagline}
              </p>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Story                                                           */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-20">
          <Container>
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="relative">
                <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-2xl border-2 border-brand-turmeric/40 md:block" />
                <img
                  src={heroImages.story}
                  alt="Traditional mango pickle in a rustic jar"
                  className="relative w-full rounded-2xl object-cover shadow-xl"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
                  Our Story
                </p>
                <h2 className="font-serif text-3xl font-bold text-brand-maroon-dark md:text-4xl">
                  {brand.story.title}
                </h2>
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-brand-ink/80">
                  <p>{brand.story.body}</p>
                  <p>{brand.about}</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Stats band                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="bg-brand-maroon py-14">
          <Container>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-4xl font-bold text-brand-turmeric md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-wide text-brand-cream/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Values                                                          */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-maroon-dark md:text-4xl">
                What Goes Into Every Jar
              </h2>
              <div className="brand-rule mt-5" />
              <p className="mt-5 text-lg text-brand-ink/70">
                A promise of taste, tradition and honest craft — held in every
                spoonful.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-brand-cream-dark bg-white/60 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="font-serif text-xl font-semibold text-brand-maroon-dark">
                    {value.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-brand-ink/75">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  CTA                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section className="pb-24">
          <Container>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-brand-maroon-dark px-8 py-14 text-center shadow-xl md:px-16">
              <h2 className="font-serif text-3xl font-bold text-brand-cream md:text-4xl">
                Taste the tradition for yourself
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-brand-cream/80">
                From Mango and Nimboo to Garlic, Ginger, Chilli and our signature
                Punjabi Mix — bring a little Khari Baoli home.
              </p>
              <a
                href="/store"
                className="mt-8 inline-block rounded-full bg-brand-turmeric px-8 py-3 font-semibold text-brand-maroon-dark shadow transition hover:bg-brand-turmeric-dark"
              >
                Explore Our Pickles
              </a>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
