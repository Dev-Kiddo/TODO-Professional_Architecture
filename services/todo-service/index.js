import express from "express";
import dotenv from "dotenv";
dotenv.config();
import todoRouter from "./src/routes/todoRoute.js";
import error from "../user-service/src/middlewares/error.js";
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (error) => {
  console.log(`Error: ${error.message}`);
  console.log("Server is Shutting down, Due to Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);
  console.log("Server is shuting down, due to Unhandled Rejection");
  process.exit(1);
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", todoRouter);

app.use(error);

app.listen(PORT, () => {
  console.log(`Todo-Service is Running on PORT: ${PORT}`);
});
