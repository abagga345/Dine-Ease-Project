import { sendMailjetMessages, SendResult } from './mailjetClient';

export const sendOrderConfirmationEmail = async (
  recipientEmail: string,
  orderId: number,
  amount: number,
  address: string,
  orderDate: string,
): Promise<SendResult> =>
  sendMailjetMessages(
    [
      {
        From: {
          Email: 'dinease@coderspro.xyz',
          Name: 'Dine-Ease',
        },
        To: [{ Email: recipientEmail }],
        Subject: 'Order Confirmation',
        TemplateID: 6992419,
        TemplateLanguage: true,
        Variables: {
          orderId,
          amount,
          address,
          orderDate,
        },
      },
    ],
    { recipientEmail, orderId },
  );
