import AppAppBar from "./AppAppBar";
import Hero from "./Hero";
import FeaturedPickles from "./FeaturedPickles";
import Collections from "./Collections";
import HeritageStory from "./HeritageStory";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

export function UserHome() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <main>
        <Hero />
        <FeaturedPickles />
        <Collections />
        <HeritageStory />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
