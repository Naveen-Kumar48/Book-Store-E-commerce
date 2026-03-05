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

const sendInvoiceEmail = async (email, order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsHtml = order.books.map(
    (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
  ).join("");

  await transporter.sendMail({
    from: '"Book Store Orders" <no-reply@myapp.com>',
    replyTo: 'no-reply@myapp.com',
    to: email,
    subject: `Invoice for Order #${order._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333;">Payment Successful!</h2>
        <p style="font-size: 16px; color: #555;">Thank you for your purchase. Here is your invoice:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4f46e5;">Order #${order._id.toString().slice(-6).toUpperCase()}</h3>
          <p style="margin: 0; color: #777;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Book title</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #4f46e5; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="font-size: 14px; color: #777;">Your order will automatically be marked as <strong>delivered</strong> in 8 hours.</p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated invoice. Please do not reply.
        </p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendInvoiceEmail };
