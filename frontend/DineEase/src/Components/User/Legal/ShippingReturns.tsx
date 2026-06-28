import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { Container } from "../../common/ui/Container";
import { brand } from "../../../config/brand";

export function ShippingReturns() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />
      <main className="py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 font-serif text-4xl font-bold text-brand-maroon-dark md:text-5xl">
              Shipping & Returns
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
                  Shipping Policy
                </h2>
                <p>
                  We are committed to delivering your {brand.name} pickles fresh and in perfect
                  condition. All orders are carefully packed to ensure safe transit.
                </p>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Delivery Timeline
                </h3>
                <ul className="ml-6 list-disc space-y-2">
                  <li><strong>Delhi NCR:</strong> 2-3 business days</li>
                  <li><strong>Metro Cities:</strong> 3-5 business days</li>
                  <li><strong>Other Cities:</strong> 5-7 business days</li>
                  <li><strong>Remote Areas:</strong> 7-10 business days</li>
                </ul>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Shipping Charges
                </h3>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Free shipping on orders above ₹999</li>
                  <li>₹50 flat shipping fee on orders below ₹999</li>
                  <li>Express delivery available at additional charges</li>
                </ul>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Order Tracking
                </h3>
                <p>
                  Once your order is dispatched, you will receive a tracking number via email and SMS.
                  You can track your order status in your account dashboard.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Returns & Refunds Policy
                </h2>
                <p>
                  Your satisfaction is our priority. We accept returns under the following conditions:
                </p>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Return Eligibility
                </h3>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Product received is damaged or defective</li>
                  <li>Wrong product delivered</li>
                  <li>Product seal is broken or tampered</li>
                  <li>Quality issues with the product</li>
                  <li>Returns must be initiated within 7 days of delivery</li>
                </ul>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Non-Returnable Items
                </h3>
                <p>
                  Due to the nature of our products (food items), we cannot accept returns for:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Products with intact seal and no quality issues</li>
                  <li>Change of mind or incorrect order placed by customer</li>
                  <li>Products past the return window of 7 days</li>
                  <li>Used or opened products (unless defective)</li>
                </ul>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Return Process
                </h3>
                <ol className="ml-6 list-decimal space-y-2">
                  <li>Contact our customer support at {brand.contact.email} or {brand.contact.phone}</li>
                  <li>Provide your order number and reason for return with photos if applicable</li>
                  <li>Our team will review and approve eligible returns within 24-48 hours</li>
                  <li>Pack the product securely in its original packaging</li>
                  <li>Our courier partner will pick up the product from your address</li>
                </ol>

                <h3 className="mb-2 mt-4 text-xl font-semibold text-brand-maroon-dark">
                  Refund Process
                </h3>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Refunds are processed within 5-7 business days after we receive the returned product</li>
                  <li>Refund will be credited to the original payment method</li>
                  <li>Shipping charges are non-refundable unless the return is due to our error</li>
                  <li>You will receive an email confirmation once the refund is processed</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Packaging & Handling
                </h2>
                <p>
                  All our products are carefully packed with bubble wrap and sealed containers to
                  prevent damage during transit. We use food-grade packaging materials to maintain
                  product freshness and quality.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Missing or Damaged Shipments
                </h2>
                <p>
                  If your order arrives damaged or if items are missing, please:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Take photos of the damaged package and products immediately</li>
                  <li>Contact us within 48 hours of delivery</li>
                  <li>We will arrange for a replacement or full refund</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-serif text-2xl font-semibold text-brand-maroon-dark">
                  Contact Customer Support
                </h2>
                <p>
                  For any questions about shipping or returns, please reach out to us:
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
