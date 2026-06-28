import crypto from "node:crypto";
import Razorpay from "razorpay";
import { logger } from "../../logger";

/**
 * Strip accidental surrounding quotes/whitespace from an env value.
 * `.env` files have quotes stripped by dotenv, but dashboard hosts (Render)
 * store values literally, so a pasted `"abc"` becomes the literal key `"abc"`.
 * (Same hardening as mailjetClient.ts.)
 */
const sanitizeKey = (v?: string): string =>
  (v ?? "").trim().replace(/^['"]+|['"]+$/g, "");

const getKeyId = (): string => sanitizeKey(process.env.RAZOR_PAY_API_KEY);
const getKeySecret = (): string => sanitizeKey(process.env.RAZOR_PAY_SECRET_KEY);
const getWebhookSecret = (): string => sanitizeKey(process.env.RAZOR_PAY_WEBHOOK_SECRET);

/** True when the order-creation keys are present. */
export const isRazorpayConfigured = (): boolean => !!getKeyId() && !!getKeySecret();

/** Lazily construct a single Razorpay SDK instance (used for order creation). */
let instance: Razorpay | null = null;
export const getRazorpay = (): Razorpay => {
  if (!isRazorpayConfigured()) {
    logger.error("Razorpay keys missing (RAZOR_PAY_API_KEY / RAZOR_PAY_SECRET_KEY)");
    throw new Error("Razorpay not configured");
  }
  if (instance === null) {
    instance = new Razorpay({ key_id: getKeyId(), key_secret: getKeySecret() });
  }
  return instance;
};

/** The public key id handed to the browser so checkout.js can open the modal. */
export const getPublicKeyId = (): string => getKeyId();

/** Constant-time compare of two hex digests. */
const safeEqual = (a: string, b: string): boolean => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
};

/**
 * Verify the signature returned by checkout.js on a successful payment:
 *   expected = HMAC_SHA256(`${orderId}|${paymentId}`, KEY_SECRET)
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const secret = getKeySecret();
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
};

/**
 * Verify a webhook delivery:
 *   expected = HMAC_SHA256(rawRequestBody, WEBHOOK_SECRET)
 * compared against the `x-razorpay-signature` header.
 */
export const verifyWebhookSignature = (rawBody: Buffer | string, signature: string): boolean => {
  const secret = getWebhookSecret();
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
};
