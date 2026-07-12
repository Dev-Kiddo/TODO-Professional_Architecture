import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async function (user, message) {
  try {
    const info = await transporter.sendMail(message);
  } catch (error) {
    console.log(`Error while sending mail: ${error}`);
  }
};
