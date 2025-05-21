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

export const sendOTP = async (
  recipientEmail: string,
  otp: string,
) => {

//   console.log("Sending Mailjet email with variables:", {
//     otp: otp,
//  });

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
            Subject: 'OTP Verification DineEase',
            TemplateID: 6992974, 
            TemplateLanguage: true,
            Variables: {
              otp: otp,
            }
          }
        ]
      });
    return true;
  } catch (err: any) {
    return false;
  }
};

