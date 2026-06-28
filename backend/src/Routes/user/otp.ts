import { logger } from '../../logger';
import { getMailjetClient } from './mailjetClient';

export type SendResult = { ok: boolean; status?: number; detail?: unknown };

export const sendOTP = async (
  recipientEmail: string,
  otp: string,
): Promise<SendResult> => {
  const mailjetClient = getMailjetClient();
  if (!mailjetClient) {
    return { ok: false, status: 0, detail: "Mailjet client not configured (missing API keys)" };
  }

  try {
    await mailjetClient
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
    return { ok: true };
  } catch (err: any) {
    // Mailjet puts the real reason in err.response.body (or err.ErrorMessage).
    const status = err?.statusCode;
    const detail = err?.response?.body ?? err?.ErrorMessage ?? err?.message;
    logger.error(
      { err: { statusCode: status, message: err?.message, body: err?.response?.body }, recipientEmail },
      "Mailjet OTP send failed"
    );
    return { ok: false, status, detail };
  }
};
