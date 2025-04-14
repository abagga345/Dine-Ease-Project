import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
  "faba11eecf0bb6b534a9ea5bd837af3c",
  "7e35ea59b34f5e39725d80dbb6df4443"
);

const request = mailjetClient
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [
      {
        From: {
          Email: 'dinease@abagga.xyz',
          Name: 'Dine-Ease-Auto-Mail',
        },
        To: [
          {
            Email: 'saakshatjain@gmail.com',
            Name: 'Saakshat Jain',
          },
          {
            Email: 'saakshat.jain.ug22@nsut.ac.in',
            Name: 'Saakshat Jain',
          }
        ],
        Subject: 'Your email flight plan!',
        TemplateID: 6902659,
      },
    ],
  });

request
  .then((result: any) => {
    console.log(result.body);
  })
  .catch((err: any) => {
    console.error('Error status:', err.statusCode);
    console.error('Error details:', err.response?.res?.statusMessage || err.message);
  });
