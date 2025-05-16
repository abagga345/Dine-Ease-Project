import mailjet from 'node-mailjet';

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
  orderDate : number
) => {

  console.log("Sending Mailjet email with variables:", {
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
                Email: "saakshatjain@gmail.com",
              },
              {
                Email: "aayushbagga2005@gmail.com",
              }
            ],
            Subject: 'Order Confirmation',
            TemplateID: 6902659, 
            TemplateLanguage: true,
            Variables: {
              order_id: orderId,
              amount,
              address,
              order_date: orderDate
            }
          }
        ]
      });

    console.log("Email sent successfully:", request.body);
  } catch (err: any) {
    console.error("Mailjet error:", err.statusCode, err.message);
  }
};
