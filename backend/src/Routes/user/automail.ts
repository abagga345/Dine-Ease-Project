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

export const sendOrderConfirmationEmail = async (
  recipientEmail: string,
  orderId: number,
  amount: number,
  address: string,
  orderDate : string
) => {
  const mailjetClient = getMailjetClient();
  if (!mailjetClient) {
    return;
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
            Subject: 'Order Confirmation',
            TemplateID: 6992419,
            TemplateLanguage: true,
            Variables: {
              orderId: orderId,
              amount,
              address,
              orderDate: orderDate
            }
          }
        ]
      });

    logger.info({ recipientEmail, orderId }, "Order confirmation email sent via Mailjet");
  } catch (err: any) {
    logger.error({ err: { statusCode: err?.statusCode, message: err?.message }, orderId }, "Mailjet order-email send failed");
  }
};
