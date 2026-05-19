const nodemailer = require('nodemailer');

const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const emailTemplates = {
  otp: (name, otp) => ({
    subject: '🔐 Your OTP for CBSE Recheck Advisor',
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">CBSE Recheck Advisor</h1>
          <p style="color:#bfdbfe;margin:8px 0 0;">Email Verification</p>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#1e293b;margin:0 0 16px;">Hello, ${name}! 👋</h2>
          <p style="color:#64748b;line-height:1.6;">Your one-time password (OTP) for email verification is:</p>
          <div style="background:#eff6ff;border:2px dashed #3b82f6;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#1e40af;">${otp}</span>
          </div>
          <p style="color:#ef4444;font-size:14px;">⏰ This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
          <p style="color:#94a3b8;font-size:12px;text-align:center;">This platform is not affiliated with CBSE. Educational guidance only.<br>For any queries contact on info@veritasco.tech</p>
        </div>
      </div>
    `,
  }),

  welcome: (name) => ({
    subject: '🎉 Welcome to CBSE Recheck Advisor!',
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;">Welcome Aboard! 🚀</h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#1e293b;">Hi ${name},</h2>
          <p style="color:#64748b;line-height:1.6;">Your account has been verified. You can now submit recheck applications and get expert guidance from our team.</p>
          <div style="background:#eff6ff;border-radius:8px;padding:20px;margin:24px 0;">
            <h3 style="color:#1e40af;margin:0 0 12px;">What you can do:</h3>
            <ul style="color:#64748b;line-height:2;margin:0;padding-left:20px;">
              <li>Submit recheck applications</li>
              <li>Upload answer sheets securely</li>
              <li>Get expert recommendations within 12 hours</li>
              <li>Track your application status</li>
            </ul>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">This platform is not affiliated with CBSE. Educational guidance only.<br>For any queries contact on info@veritasco.tech</p>
        </div>
      </div>
    `,
  }),

  paymentConfirmation: (name, requestId, amount, subjects) => ({
    subject: `✅ Payment Confirmed – ${requestId}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;">Payment Successful ✅</h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#1e293b;">Hi ${name},</h2>
          <p style="color:#64748b;">Your payment has been received and your application is now under review.</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px;"><strong>Request ID:</strong> <span style="color:#1e40af;font-family:monospace;">${requestId}</span></p>
            <p style="margin:0 0 8px;"><strong>Amount Paid:</strong> ₹${amount}</p>
            <p style="margin:0;"><strong>Subjects:</strong> ${subjects.join(', ')}</p>
          </div>
          <p style="color:#64748b;">Our expert team will review your application within <strong>12 hours</strong>.</p>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">This platform is not affiliated with CBSE. Educational guidance only.<br>For any queries contact on info@veritasco.tech</p>
        </div>
      </div>
    `,
  }),

  recommendationReady: (name, requestId) => ({
    subject: `📋 Your Recommendation is Ready – ${requestId}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#a78bfa);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;">Recommendation Ready! 📋</h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#1e293b;">Hi ${name},</h2>
          <p style="color:#64748b;line-height:1.6;">Your evaluation is done! You can now check it on <a href="https://recheck.veritasco.tech" style="color:#3b82f6;text-decoration:none;">recheck.veritasco.tech</a>.</p>
          <p style="color:#64748b;">Please login to your dashboard to view the detailed recommendation for application <strong>${requestId}</strong>.</p>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">This platform is not affiliated with CBSE. Educational guidance only.<br>For any queries contact on info@veritasco.tech</p>
        </div>
      </div>
    `,
  }),

  adminMessage: (name, subject, messageContent) => ({
    subject: `📩 New Message: ${subject}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8faff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;">New Message from Admin</h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#1e293b;">Hi ${name},</h2>
          <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px;padding:20px;margin:24px 0;">
            <p style="color:#1e293b;margin:0;line-height:1.6;">${messageContent}</p>
          </div>
          <p style="color:#64748b;">Please login to your dashboard on <a href="https://recheck.veritasco.tech" style="color:#3b82f6;text-decoration:none;">recheck.veritasco.tech</a> to reply.</p>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">This platform is not affiliated with CBSE. Educational guidance only.<br>For any queries contact on info@veritasco.tech</p>
        </div>
      </div>
    `,
  }),
};

const sendEmail = async ({ to, templateKey, templateData = [], subject, html }) => {
  const transporter = createTransporter();

  let emailContent;
  if (templateKey && emailTemplates[templateKey]) {
    emailContent = emailTemplates[templateKey](...templateData);
  } else {
    emailContent = { subject, html };
  }

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'CBSE Recheck Advisor'}" <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to,
    subject: emailContent.subject,
    html: emailContent.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send error:', err && err.message ? err.message : err);
    return { success: false, error: err.message || err };
  }
};

module.exports = { sendEmail, emailTemplates };
