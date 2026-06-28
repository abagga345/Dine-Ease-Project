import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "../../common/ui/Container";
import { brand } from "../../../config/brand";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-brand-maroon-dark py-16 text-brand-cream">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-turmeric">
            Get in Touch
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
            Contact Us
          </h2>
          <p className="mb-12 text-brand-cream/80">
            Have questions about our pickles or want to place a custom order? We'd love to hear from you.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-brand-cream/5 p-6 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-brand-turmeric/20 p-3">
                <Mail className="text-brand-turmeric" size={24} />
              </div>
              <h3 className="mb-2 font-semibold">Email Us</h3>
              <a
                href={`mailto:${brand.contact.email}`}
                className="text-sm text-brand-cream/80 transition hover:text-brand-turmeric"
              >
                {brand.contact.email}
              </a>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-brand-cream/5 p-6 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-brand-turmeric/20 p-3">
                <Phone className="text-brand-turmeric" size={24} />
              </div>
              <h3 className="mb-2 font-semibold">Call Us</h3>
              <a
                href={`tel:${brand.contact.phone}`}
                className="text-sm text-brand-cream/80 transition hover:text-brand-turmeric"
              >
                {brand.contact.phone}
              </a>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-brand-cream/5 p-6 backdrop-blur-sm">
              <div className="mb-4 rounded-full bg-brand-turmeric/20 p-3">
                <MapPin className="text-brand-turmeric" size={24} />
              </div>
              <h3 className="mb-2 font-semibold">Visit Us</h3>
              <p className="text-center text-sm text-brand-cream/80">
                {brand.contact.address}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="mb-4 text-sm text-brand-cream/80">
              Store Hours: Monday - Saturday, 10:00 AM - 8:00 PM
            </p>
            <p className="text-sm text-brand-cream/60">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
