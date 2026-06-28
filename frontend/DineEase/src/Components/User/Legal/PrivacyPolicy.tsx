import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { Container } from "../../common/ui/Container";
import { brand } from "../../../config/brand";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <main className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 font-serif text-4xl font-bold text-brand-maroon-dark md:text-5xl">
              Privacy Policy
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
                  Introduction
                </h2>
                <p>
                  {brand.name} ("we", "us", or "our") respects your privacy and is committed to
                  protecting your personal data. This privacy policy explains how we collect, use,
                  and safeguard your information when you visit our website and purchase our products.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Information We Collect
                </h2>
                <p>We collect the following types of information:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong>Personal Information:</strong> Name, email address, phone number,
                    and delivery address when you place an order.
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Payment details processed securely
                    through our payment gateway partners.
                  </li>
                  <li>
                    <strong>Order Information:</strong> Details about products you purchase,
                    order history, and preferences.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you interact with our website.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  How We Use Your Information
                </h2>
                <p>We use your information to:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Data Security
                </h2>
                <p>
                  We implement appropriate security measures to protect your personal information
                  from unauthorized access, alteration, disclosure, or destruction. However, no
                  method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
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
