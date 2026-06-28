import mailjet from 'node-mailjet';
import { logger } from '../../logger';

/**
 * Strip accidental surrounding quotes/whitespace from an env value.
 *
 * `.env` files have their quotes stripped by dotenv, but dashboard-based hosts
 * (Render, etc.) store values literally — so a pasted `"abc123"` becomes the
 * literal key `"abc123"` (with quotes) and Mailjet rejects it with 401. This
 * makes the keys resilient to that very common misconfiguration.
 */
const sanitizeKey = (v?: string): string =>
  (v ?? '').trim().replace(/^['"]+|['"]+$/g, '');

/**
 * Lazily create the Mailjet client. Returns null (and logs) when keys are
 * missing, so a misconfigured environment never crashes the server at boot.
 */
export const getMailjetClient = () => {
  const mailjetPublic = sanitizeKey(process.env.MAIL_JET_PUBLIC_KEY);
  const mailjetPrivate = sanitizeKey(process.env.MAIL_JET_PRIVATE_KEY);
  if (!mailjetPublic || !mailjetPrivate) {
    logger.error('Missing Mailjet API keys in environment variables');
    return null;
  }
  return mailjet.apiConnect(mailjetPublic, mailjetPrivate);
};
