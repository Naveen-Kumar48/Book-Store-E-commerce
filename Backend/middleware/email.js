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
    from: "OTP Auth <no-reply@app.com>",
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes</p>`,
  });
};

module.exports = { sendEmail };
