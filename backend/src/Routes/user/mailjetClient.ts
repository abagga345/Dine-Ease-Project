import https from 'node:https';
import { logger } from '../../logger';

/**
 * Strip accidental surrounding quotes/whitespace from an env value.
 * `.env` files have quotes stripped by dotenv, but dashboard hosts (Render)
 * store values literally, so a pasted `"abc"` becomes the literal key `"abc"`.
 */
const sanitizeKey = (v?: string): string =>
  (v ?? '').trim().replace(/^['"]+|['"]+$/g, '');

// Force IPv4 + a fresh socket per request. Render's IPv6 path to
// api.mailjet.com and reused keep-alive sockets both surface as
// "read ECONNRESET"; this agent avoids both.
const ipv4Agent = new https.Agent({ family: 4, keepAlive: false });

const REQUEST_TIMEOUT_MS = 15000;

export type SendResult = { ok: boolean; status?: number; detail?: unknown };

type HttpResponse = { statusCode: number; body: string };

/** Raw POST to the Mailjet Send API over node:https (no node-mailjet/axios). */
const postToMailjet = (messages: unknown[], pub: string, priv: string): Promise<HttpResponse> =>
  new Promise((resolve, reject) => {
    const payload = JSON.stringify({ Messages: messages });
    const auth = Buffer.from(`${pub}:${priv}`).toString('base64');

    const req = https.request(
      {
        method: 'POST',
        hostname: 'api.mailjet.com',
        path: '/v3.1/send',
        agent: ipv4Agent,
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          Authorization: `Basic ${auth}`,
        },
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body: data }));
      },
    );

    req.on('timeout', () => req.destroy(Object.assign(new Error('Mailjet request timed out'), { code: 'ETIMEDOUT' })));
    req.on('error', reject);
    req.write(payload);
    req.end();
  });

/** Transient network failures worth retrying (connection never delivered a response). */
const isTransientNetworkError = (err: any): boolean => {
  const haystack = `${err?.code ?? ''} ${err?.cause?.code ?? ''} ${err?.message ?? ''}`;
  return /ECONNRESET|ETIMEDOUT|EAI_AGAIN|ECONNREFUSED|EPIPE|socket hang up|network/i.test(haystack);
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Send v3.1 Mailjet messages. Retries transient network errors (e.g. the
 * ECONNRESET seen from Render). HTTP-level errors (4xx/5xx) are returned, not
 * retried.
 */
export const sendMailjetMessages = async (
  messages: unknown[],
  ctx: Record<string, unknown> = {},
): Promise<SendResult> => {
  const pub = sanitizeKey(process.env.MAIL_JET_PUBLIC_KEY);
  const priv = sanitizeKey(process.env.MAIL_JET_PRIVATE_KEY);
  if (!pub || !priv) {
    logger.error('Missing Mailjet API keys in environment variables');
    return { ok: false, status: 0, detail: 'Mailjet client not configured (missing API keys)' };
  }

  const maxAttempts = 3;
  let lastDetail: unknown;
  let lastStatus: number | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await postToMailjet(messages, pub, priv);
      lastStatus = res.statusCode;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logger.info({ ...ctx, attempt }, 'Email sent via Mailjet');
        return { ok: true, status: res.statusCode };
      }
      // HTTP-level rejection (auth/sender/template). Surface, don't retry.
      let parsed: unknown = res.body;
      try { parsed = JSON.parse(res.body); } catch { /* keep raw */ }
      lastDetail = parsed;
      logger.error({ status: res.statusCode, body: parsed, ...ctx, attempt }, 'Mailjet send rejected');
      return { ok: false, status: res.statusCode, detail: parsed };
    } catch (err: any) {
      lastStatus = undefined;
      lastDetail = err?.message ?? String(err);
      logger.error({ err: { code: err?.code, message: err?.message }, ...ctx, attempt }, 'Mailjet send network error');
      if (attempt < maxAttempts && isTransientNetworkError(err)) {
        await delay(400 * attempt);
        continue;
      }
      break;
    }
  }

  return { ok: false, status: lastStatus, detail: lastDetail };
};
