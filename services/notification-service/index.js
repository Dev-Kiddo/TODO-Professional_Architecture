import express from "express";
import dotenv from "dotenv";
import sendEmail from "./src/sendEmail.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

sendEmail();

app.listen(PORT, () => {
  console.log(`Service is running on PORT: ${PORT}`);
});
