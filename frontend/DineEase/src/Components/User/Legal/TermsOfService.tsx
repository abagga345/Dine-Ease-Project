import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { Container } from "../../common/ui/Container";
import { brand } from "../../../config/brand";

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <main className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 font-serif text-4xl font-bold text-brand-maroon-dark md:text-5xl">
              Terms of Service
            </h1>
            <p className="mb-8 text-sm text-brand-ink/60">
              Last updated: {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>

            <div className="prose prose-lg max-w-none space-y-6 text-brand-ink/80">
              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Agreement to Terms
                </h2>
                <p>
                  By accessing and using the {brand.name} website and services, you accept and agree
                  to be bound by these Terms of Service. If you do not agree to these terms, please
                  do not use our services.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Product Information
                </h2>
                <p>
                  We strive to provide accurate descriptions and images of our pickles and products.
                  However, we do not warrant that product descriptions, images, or other content is
                  accurate, complete, reliable, or error-free. Actual product packaging and materials
                  may contain different information than shown on our website.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Orders and Pricing
                </h2>
                <ul className="ml-6 list-disc space-y-2">
                  <li>All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
                  <li>We reserve the right to change prices at any time without prior notice.</li>
                  <li>Orders are subject to acceptance and availability.</li>
                  <li>We reserve the right to refuse or cancel any order for any reason.</li>
                  <li>Payment must be received before we dispatch your order.</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  User Account
                </h2>
                <p>
                  When you create an account with us, you are responsible for:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Product Quality and Shelf Life
                </h2>
                <p>
                  Our pickles are handcrafted using traditional methods. Each product comes with
                  a best-before date. We recommend consuming products within this period for optimal
                  taste and quality. Store products as per the instructions on the packaging.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Limitation of Liability
                </h2>
                <p>
                  {brand.name} shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of our products or
                  services. Our total liability shall not exceed the amount you paid for the product.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Intellectual Property
                </h2>
                <p>
                  All content on this website, including text, graphics, logos, images, and recipes,
                  is the property of {brand.name} and is protected by copyright and trademark laws.
                  You may not reproduce, distribute, or use any content without our written permission.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Governing Law
                </h2>
                <p>
                  These Terms of Service are governed by the laws of India. Any disputes shall be
                  subject to the exclusive jurisdiction of the courts in Delhi, India.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-2">
                  Email: <a href={`mailto:${brand.contact.email}`} className="text-brand-maroon hover:underline">{brand.contact.email}</a><br />
                  Phone: {brand.contact.phone}<br />
                  Address: {brand.contact.address}
                </p>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
