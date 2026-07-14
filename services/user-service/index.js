import express from "express";
import dotenv from "dotenv";
import error from "./src/middlewares/error.js";
dotenv.config();

import authRouter from "./src/routes/authRoute.js";
import cookieParser from "cookie-parser";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Body parse middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5002", process.env.CLIENT_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/", authRouter);

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shuting down, due to Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shuting down, due to Unhandled Rejection");
  process.exit(1);
});

// Err Middleware
app.use(error);

app.listen(PORT, () => {
  console.log(`User-Service is running on PORT: ${PORT}`);
});
