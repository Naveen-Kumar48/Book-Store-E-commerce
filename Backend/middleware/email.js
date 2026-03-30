const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in environment variables");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendEmail = async (email, otp) => {
  console.log("Sending OTP:", otp);
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✓ set" : "✗ MISSING");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ set" : "✗ MISSING");

  const transporter = createTransporter();

  try {
    await transporter.verify();
    console.log("✓ Transporter verified successfully");
  } catch (verifyErr) {
    console.error("✗ Transporter verify failed:", verifyErr.message);
    throw new Error(`Email configuration error: ${verifyErr.message}`);
  }

  await transporter.sendMail({
    from: `"Book Store - OTP Verification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code - Book Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">📚 Book Store</h1>
        </div>
        
        <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for signing up! Please use the verification code below to complete your registration:
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 36px; color: #4f46e5; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
        </div>
        
        <p style="font-size: 14px; color: #777; line-height: 1.6;">
          ⏰ This code will expire in <strong>10 minutes</strong>.<br>
          🔒 For security reasons, do not share this code with anyone.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #999; text-align: center; line-height: 1.5;">
          This is an automated email from Book Store.<br>
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `,
  });
  
  console.log("✓ OTP email sent successfully to:", email);
};

const sendInvoiceEmail = async (email, order) => {
  console.log("Sending invoice email to:", email);
  
  const transporter = createTransporter();

  const itemsHtml = order.books.map(
    (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
  ).join("");

  await transporter.sendMail({
    from: `"Book Store - Orders" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Order Confirmation #${order._id.toString().slice(-6).toUpperCase()} - Book Store`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">📚 Book Store</h1>
        </div>
        
        <div style="background: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">✅ Payment Successful!</h2>
        </div>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for your purchase! Your order has been confirmed.
        </p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4f46e5;">Order #${order._id.toString().slice(-6).toUpperCase()}</h3>
          <p style="margin: 5px 0; color: #666;">📅 Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 5px 0; color: #666;">📧 Email: ${email}</p>
        </div>

        <h3 style="color: #333; margin-top: 30px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0; color: #333;">Book Title</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e0e0e0; color: #333;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0; color: #333;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f9fa;">
              <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px; color: #333;">Total Amount:</td>
              <td style="padding: 15px; text-align: right; font-weight: bold; color: #4f46e5; font-size: 20px;">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            📦 Your order will be automatically marked as <strong>delivered</strong> in 8 hours.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #999; text-align: center; line-height: 1.5;">
          This is an automated invoice from Book Store.<br>
          Thank you for shopping with us! 📚
        </p>
      </div>
    `,
  });
  
  console.log("✓ Invoice email sent successfully to:", email);
};

module.exports = { sendEmail, sendInvoiceEmail };
