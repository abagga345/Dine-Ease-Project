import { sendMailjetMessages, SendResult } from './mailjetClient';

export const sendOTP = async (
  recipientEmail: string,
  otp: string,
): Promise<SendResult> =>
  sendMailjetMessages(
    [
      {
        From: {
          Email: 'dinease@coderspro.xyz',
          Name: 'Dine-Ease',
        },
        To: [{ Email: recipientEmail }],
        Subject: 'OTP Verification DineEase',
        TemplateID: 6992974,
        TemplateLanguage: true,
        Variables: { otp },
      },
    ],
    { recipientEmail },
  );
