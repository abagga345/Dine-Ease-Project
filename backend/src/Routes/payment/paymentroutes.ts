import express from "express";
import { Request, Response } from "express";
import { prisma } from "../../prismaClient";
import { verifyWebhookSignature } from "../user/razorpayClient";
import { sendOrderConfirmationEmail } from "../user/automail";

export const paymentRouter = express.Router();

// Razorpay webhook — the authoritative source of payment status (survives the
// user closing the tab before client-side verification runs). NO auth: it's
// authenticated by the HMAC signature over the raw request body.
//
// `req.rawBody` is captured by the `express.json({ verify })` hook in index.ts.
paymentRouter.post("/webhook", async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const rawBody = (req as any).rawBody as Buffer | undefined;

  if (!rawBody || !signature || !verifyWebhookSignature(rawBody, signature)) {
    req.log.warn("Razorpay webhook rejected: invalid signature");
    res.status(400).json({ message: "Invalid signature" });
    return;
  }

  const event = req.body?.event as string | undefined;
  const payment = req.body?.payload?.payment?.entity;
  const orderId = payment?.order_id as string | undefined;
  const paymentId = payment?.id as string | undefined;

  try {
    if (!orderId) {
      // Not a payment event we act on (e.g. payment_link.*). Acknowledge.
      res.status(200).json({ received: true });
      return;
    }

    if (event === "payment.captured") {
      // Flip Pending -> Paid. count===1 means WE performed the transition, so
      // send the confirmation email exactly once (idempotent across retries and
      // the client-side /payment/verify path).
      const updated = await prisma.orders.updateMany({
        where: { razorpayOrderId: orderId, paymentStatus: "Pending" },
        data: { paymentStatus: "Paid", razorpayPaymentId: paymentId },
      });

      if (updated.count === 1) {
        const order = await prisma.orders.findFirst({
          where: { razorpayOrderId: orderId },
          include: { address: true },
        });
        if (order) {
          sendOrderConfirmationEmail(
            order.email,
            order.id,
            order.amount,
            order.address.houseStreet + " , " + order.address.state + " , " + order.address.pincode,
            order.creationDate.toLocaleDateString()
          ).catch((err) => req.log.error({ err, orderId: order.id }, "Order confirmation email failed"));
        }
      }
      req.log.info({ razorpayOrderId: orderId, event }, "Razorpay webhook: payment captured");
    } else if (event === "payment.failed") {
      await prisma.orders.updateMany({
        where: { razorpayOrderId: orderId, paymentStatus: "Pending" },
        data: { paymentStatus: "Failed", razorpayPaymentId: paymentId },
      });
      req.log.info({ razorpayOrderId: orderId, event }, "Razorpay webhook: payment failed");
    }

    res.status(200).json({ received: true });
  } catch (err) {
    // Return 500 so Razorpay retries delivery on a transient failure.
    req.log.error({ err, event }, "Razorpay webhook handler error");
    res.status(500).json({ message: "Webhook handler error" });
  }
});
