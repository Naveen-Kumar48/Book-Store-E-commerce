const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  console.log("DEV OTP:", otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    // 3. Instead, show a generic sender name like "Security Team" or "OTP Verification".
    // 4. Use a no-reply email address (example: no-reply@myapp.com) so users cannot reply.
    from: '"OTP Verification" <no-reply@myapp.com>',

    // 5. Configure the email headers so replies go to a no-reply address.
    replyTo: 'no-reply@myapp.com',

    to: email,
    subject: "OTP Verification Code",

    // 6. Include a message in the email body saying "This is an automated email. Please do not reply."
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p style="font-size: 16px; color: #555;">Your verification code is:</p>
        <h1 style="font-size: 32px; color: #4f46e5; letter-spacing: 5px; margin: 10px 0;">${otp}</h1>
        <p style="font-size: 14px; color: #777;">This code is valid for 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `,
  });
};

module.exports = { sendEmail };
