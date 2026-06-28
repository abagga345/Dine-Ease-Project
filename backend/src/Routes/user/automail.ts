import { logger } from '../../logger';
import { getMailjetClient } from './mailjetClient';

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
