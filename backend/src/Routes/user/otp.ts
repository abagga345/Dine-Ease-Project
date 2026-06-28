import mailjet from 'node-mailjet';
import { logger } from '../../logger';

// Lazily create the Mailjet client so a missing key doesn't crash the server
// at import/boot time. Returns null (and logs) when keys are unavailable.
const getMailjetClient = () => {
  const mailjetPublic = process.env.MAIL_JET_PUBLIC_KEY;
  const mailjetPrivate = process.env.MAIL_JET_PRIVATE_KEY;
  if (!mailjetPublic || !mailjetPrivate) {
    logger.error('Missing Mailjet API keys in environment variables');
    return null;
  }
  return mailjet.apiConnect(mailjetPublic, mailjetPrivate);
};

export const sendOTP = async (
  recipientEmail: string,
  otp: string,
) => {
  const mailjetClient = getMailjetClient();
  if (!mailjetClient) {
    return false;
  }

  try {
    const request = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'dinease@coderspro.xyz',
              Name: 'Dine-Ease',
            },
            To: [
              {
                Email: recipientEmail,
              }
            ],
            Subject: 'OTP Verification DineEase',
            TemplateID: 6992974,
            TemplateLanguage: true,
            Variables: {
              otp: otp,
            }
          }
        ]
      });
    logger.info({ recipientEmail }, "OTP email sent via Mailjet");
    return true;
  } catch (err: any) {
    logger.error({ err: { statusCode: err?.statusCode, message: err?.message }, recipientEmail }, "Mailjet OTP send failed");
    return false;
  }
};
