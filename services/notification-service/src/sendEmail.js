import nodemailer from "nodemailer";
import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log(process.env.EMAIL_USER);

const sendEmail = async function () {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");

    const channel = await connection.createChannel();

    await channel.assertQueue("user_register", { durable: true });

    channel.prefetch(1);

    channel.consume("user_register", async (message) => {
      if (!message) console.log("message not found");

      console.log("message", message);

      const content = JSON.parse(message.content.toString());

      console.log("content1", content);

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: content.email,
        subject: "Email Using Nodemailer_RabbitMQ",
        text: "Hello world!",
        html: `<b>Hehe now you have understood it, Right?</b><h1>${content.email}</h1>`,
      });

      console.log("Email Sent", info.messageId);
    });
  } catch (error) {
    console.log(`Error while sending mail: ${error}`);
  }
};

export default sendEmail;
