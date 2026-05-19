const nodemailer = require('nodemailer');
require('dotenv').config();

const configs = [
  { host: process.env.SMTP_HOST || 'smtp.zeptomail.in', port: parseInt(process.env.SMTP_PORT || '465', 10), secure: true },
  { host: process.env.SMTP_HOST || 'smtp.zeptomail.in', port: 587, secure: false, requireTLS: true },
  { host: 'smtp.zeptomail.com', port: 465, secure: true },
  { host: 'smtp.zeptomail.com', port: 587, secure: false, requireTLS: true },
];

const auth = { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD };

async function testConfig(cfg) {
  const conf = { ...cfg, auth, logger: true, debug: true, connectionTimeout: 10000 };
  const transporter = nodemailer.createTransport(conf);
  try {
    console.log('Testing', `${conf.host}:${conf.port}`, `secure=${conf.secure}`);
    await transporter.verify();
    console.log(`OK: ${conf.host}:${conf.port}`);
    return { ok: true, conf };
  } catch (err) {
    console.error(`FAIL: ${conf.host}:${conf.port} ->`, err && err.message ? err.message : err);
    return { ok: false, error: err };
  }
}

(async () => {
  for (const cfg of configs) {
    const res = await testConfig(cfg);
    if (res.ok) {
      console.log('Found working SMTP config:', `${res.conf.host}:${res.conf.port}`);
      process.exit(0);
    }
  }
  console.error('No SMTP config worked.');
  process.exit(1);
})();
