import dotenv from "dotenv";
dotenv.config();
import express from "express";
import sendEmail from "./src/sendEmail.js";

const app = express();
const PORT = process.env.PORT || 3000;

sendEmail();

app.listen(PORT, () => {
  console.log(`Notification-Service is running on PORT: ${PORT}`);
});
