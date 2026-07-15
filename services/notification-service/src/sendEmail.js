import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import amqp from "amqplib";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// console.log(process.env.EMAIL_USER);

const sendEmail = async function () {
  try {
    //? RABBITMQ CONFIG's
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    const channel = await connection.createChannel();

    await channel.assertQueue("user_register", { durable: true });
    await channel.assertQueue("todo_created", { durable: true });

    channel.prefetch(1);

    channel.consume("user_register", async (message) => {
      try {
        if (!message) {
          console.log("message not found");
          return;
        }
        console.log("Received Message");
        const content = JSON.parse(message.content.toString());
        console.log("CONTENT", content);

        if (content.event === "user_register") {
          await sendWelcomeEmail(content);
        }

        channel.ack(message);
      } catch (error) {
        console.error("Error processing message:", error.message);
        channel.nack(message, false, true);
      }
    });

    channel.consume("todo_created", async (message) => {
      try {
        if (!message) {
          console.log("message not found");
          return;
        }
        console.log("Received Message");
        const content = JSON.parse(message.content.toString());

        console.log("CONTENT", content);

        if (content.event === "todo_created") {
          await sendTodoCreatedNotification(content);
        }

        channel.ack(message);
      } catch (error) {
        console.error("Error processing message:", error.message);
        channel.nack(message, false, true);
      }
    });
  } catch (error) {
    console.error(`Error while sending mail: ${error}`);
  }
};

const sendWelcomeEmail = async function (content) {
  console.log("Sending email...");
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: content.data.email,
    subject: "📧-Todo Micro services",
    html: `<b>Hello ${content.data.name}</b>
    <p>Your Registration Success.</p>
    <p>Now, you can start to create todo's🎉</p>
    `,
  });

  console.log("Email Sent", info.messageId);
};

const sendTodoCreatedNotification = async function (content) {
  console.log("Sending email...");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: content.email,
    subject: "📧-Todo Micro services",
    html: `<b>Hello!</b><p>Your Todo Creation Success.</p>`,
  });

  console.log("Email Sent", info.messageId);
};

export default sendEmail;
