"use server";

import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env["SMTP_HOST"] ?? "smtp.hostinger.com",
    port: Number(process.env["SMTP_PORT"] ?? 465),
    secure: true,
    auth: {
      user: process.env["SMTP_USER"],
      pass: process.env["SMTP_PASS"],
    },
  });
}

export async function sendOtpEmail(otp: string) {
  const to = process.env["OTP_EMAIL"] ?? "info@celsenergy.com";
  const from = process.env["SMTP_USER"] ?? "info@celsenergy.com";

  const transport = getTransport();
  await transport.sendMail({
    from: `CELS Energy Admin <${from}>`,
    to,
    subject: "CELS Energy Admin — Your OTP Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#166534;margin-bottom:8px;">CELS Energy Admin</h2>
        <p style="color:#374151;margin-bottom:24px;">Your one-time verification code is:</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#166534;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });
}
