// config/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ELearn Platform <noreply@elearn.com>',
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    // In development, log the email details to console instead of failing
    console.error('[Email] Failed to send email:', err.message);
    console.log('[Email] Would have sent:');
    console.log('  To:', to);
    console.log('  Subject:', subject);
    // Don't throw — email failures shouldn't crash the request in dev
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .body { padding: 40px 30px; }
        .body p { color: #4b5563; line-height: 1.7; font-size: 16px; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #4f46e5; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }
        .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 13px; }
        .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-top: 16px; font-size: 14px; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 ELearn Platform</h1>
        </div>
        <div class="body">
          <p><strong>Password Reset Request</strong></p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="btn">Reset My Password</a>
          <div class="note">⏰ This link expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</div>
          <p style="margin-top: 24px; font-size: 14px; color: #9ca3af;">Or copy this URL: <br><a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a></p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} ELearn Platform. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to, subject: 'Reset Your ELearn Password', html });
};

module.exports = { sendEmail, sendPasswordResetEmail };
