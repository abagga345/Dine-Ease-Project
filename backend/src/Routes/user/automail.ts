import mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); 


const mailjetPublic = process.env.MAIL_JET_PUBLIC_KEY;
const mailjetPrivate = process.env.MAIL_JET_PRIVATE_KEY;

if (!mailjetPublic || !mailjetPrivate) {
  throw new Error('Missing Mailjet API keys in environment variables');
}

const mailjetClient = mailjet.apiConnect(mailjetPublic, mailjetPrivate);


export const sendOrderConfirmationEmail = async (
  recipientEmail: string,
  orderId: number,
  amount: number,
  address: string,
  orderDate : string
) => {

  // console.log("Sending Mailjet email with variables:", {
    order_id: orderId,
    amount,
    address,
    order_date: orderDate,
  });

  try {
    const request = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'dinease@abagga.xyz',
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

    // console.log("Email sent successfully:", request.body);
  } catch (err: any) {
    console.error("Mailjet error:", err.statusCode, err.message);
  }
};

