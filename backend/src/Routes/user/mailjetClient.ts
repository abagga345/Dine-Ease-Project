import mailjet from 'node-mailjet';
import { logger } from '../../logger';

/**
 * Strip accidental surrounding quotes/whitespace from an env value.
 * `.env` files have quotes stripped by dotenv, but dashboard hosts (Render)
 * store values literally, so a pasted `"abc"` becomes the literal key `"abc"`.
 */
const sanitizeKey = (v?: string): string =>
  (v ?? '').trim().replace(/^['"]+|['"]+$/g, '');

/**
 * Lazily create the Mailjet client. Returns null (and logs) when keys are
 * missing. A 15s timeout caps sockets that hang on flaky cloud networks.
 */
export const getMailjetClient = () => {
  const mailjetPublic = sanitizeKey(process.env.MAIL_JET_PUBLIC_KEY);
  const mailjetPrivate = sanitizeKey(process.env.MAIL_JET_PRIVATE_KEY);
  if (!mailjetPublic || !mailjetPrivate) {
    logger.error('Missing Mailjet API keys in environment variables');
    return null;
  }
  return mailjet.apiConnect(mailjetPublic, mailjetPrivate, {
    options: { timeout: 15000 },
  });
};

export type SendResult = { ok: boolean; status?: number; detail?: unknown };

/** Transient network failures worth retrying (no HTTP status was returned). */
const isTransientNetworkError = (err: any): boolean => {
  const haystack = `${err?.code ?? ''} ${err?.cause?.code ?? ''} ${err?.ErrorMessage ?? ''} ${err?.message ?? ''}`;
  return /ECONNRESET|ETIMEDOUT|EAI_AGAIN|ECONNREFUSED|EPIPE|socket hang up|network|timeout/i.test(haystack);
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Send v3.1 Mailjet messages with retry on transient network errors
 * (e.g. ECONNRESET from Render's outbound path). Auth/validation errors
 * (which carry an HTTP status) are NOT retried — they won't improve.
 */
export const sendMailjetMessages = async (
  messages: unknown[],
  ctx: Record<string, unknown> = {},
): Promise<SendResult> => {
  const client = getMailjetClient();
  if (!client) {
    return { ok: false, status: 0, detail: 'Mailjet client not configured (missing API keys)' };
  }

  const maxAttempts = 3;
  let lastDetail: unknown;
  let lastStatus: number | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.post('send', { version: 'v3.1' }).request({ Messages: messages });
      logger.info({ ...ctx, attempt }, 'Email sent via Mailjet');
      return { ok: true };
    } catch (err: any) {
      lastStatus = err?.statusCode;
      lastDetail = err?.response?.body ?? err?.ErrorMessage ?? err?.message;
      logger.error(
        { err: { statusCode: lastStatus, code: err?.code, message: err?.message, body: err?.response?.body }, ...ctx, attempt },
        'Mailjet send failed',
      );

      const retryable = lastStatus == null && isTransientNetworkError(err);
      if (attempt < maxAttempts && retryable) {
        await delay(400 * attempt);
        continue;
      }
      break;
    }
  }

  return { ok: false, status: lastStatus, detail: lastDetail };
};
