const nodemailer = require('nodemailer');
require('dotenv').config();

async function run() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zeptomail.in',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    logger: true,
    debug: true,
  });

  try {
    await transporter.verify();
    console.log('SMTP connection OK');
  } catch (err) {
    console.error('SMTP verify error:', err && err.message ? err.message : err);
    if (err && err.response) console.error('SMTP response:', err.response);
    process.exitCode = 1;
  }
}

run();
