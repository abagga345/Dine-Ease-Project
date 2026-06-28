import { logger } from '../../logger';
import { getMailjetClient } from './mailjetClient';

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
