const {SESv2Client, SendEmailCommand} = require('@aws-sdk/client-sesv2');

const ses = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function sendEmail({to, subject, html}) {
  const params ={
    FromEmailAddress: process.env.SES_FROM,
    Destination: {ToAddresses: [to]},
    Content: {
      Simple: {
        Subject: {Data: subject},
        Body: {Html: {Data: html}},
      },
    },
  }; 
  const result = await ses.send(new SendEmailCommand(params));
  return result;
}

async function sendVeriEmail(to, code) {
  const subject = 'Verify your email - LightPlan';
  const html = `
    <p>Your verification code is <b>${code}</b>.</p>
    <p>It expires in 10 minutes.</p>
  `; 
  await sendEmail({to, subject, html}); 
}

async function sendResetEmail(to, link) {
  const subject = 'Reset your password - LightPlan'; 
  const html = `
    <p>Click the link below to reset your password (valid for 1 hour):</p>
    <p><a href="${link}">${link}</a></p>
  `;
  await sendEmail({to, subject, html});
}

module.exports = {sendVeriEmail, sendResetEmail}; 