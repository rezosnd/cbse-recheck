require('dotenv').config();

(async () => {
  const apiKey = process.env.ZEPTO_API_KEY || process.env.ZOHO_ENCZAPKEY;
  if (!apiKey) {
    console.error('No ZeptoMail API key configured (ZEPTO_API_KEY)');
    process.exit(1);
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_EMAIL;
  const to = process.env.ADMIN_EMAIL || 'founder@veritasco.tech';

  const payload = {
    from,
    to,
    subject: 'ZeptoMail REST API test',
    content: [{ type: 'html', value: '<p>ZeptoMail REST API test message</p>' }],
  };

  try {
    const res = await fetch('https://api.zeptomail.in/v1/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Zoho-enczapikey': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('ZeptoMail API error', res.status, data);
      process.exit(1);
    }

    console.log('ZeptoMail API send success', data);
  } catch (err) {
    console.error('ZeptoMail API send failed', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
