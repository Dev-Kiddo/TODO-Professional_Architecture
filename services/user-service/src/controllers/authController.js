import pool from "../config/dbConfig.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import amqp from "amqplib";

const isProduction = process.env.NODE_ENV === "production";

export const getUsers = AsyncHandler(async (req, res, next) => {
  const users = await pool.query(`
        SELECT * FROM users
        `);

  if (users.rows.length === 0) {
    return res.status(200).json({
      success: true,
      usersCount: users.rows.length,
      message: "No users registerd!",
    });
  }

  return res.status(200).json({
    success: true,
    usersCount: users.rows.length,
    message: "Get All Users Successfuly!",
    users: users.rows,
  });
});

export const getCurrentUser = AsyncHandler(async (req, res, next) => {
  const { email } = req.user;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "User not found!",
    });
  }

  const currentUser = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  if (currentUser.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: "User not found!",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Get Current User Successfuly!",
    user: currentUser.rows[0],
  });
});

export const getUser = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log("ID", id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id not found!",
    });
  }

  const currentUser = await pool.query(
    `
        SELECT * FROM users WHERE id=$1
        `,
    [id],
  );

  if (currentUser.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: "User not found!",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Get User Successfuly!",
    data: currentUser.rows[0],
  });
});

export const registerUser = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const createTable = await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(250) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

  const existingUser = await pool.query(
    `
    SELECT email from users WHERE email=$1
    `,
    [email],
  );

  // console.log("existingUser", existingUser);

  if (existingUser.rows.length > 0) {
    return res.status(200).json({
      success: false,
      message: "User already registerd with this email!",
    });
  }

  const hashPassword = await bcrypt.hash(password, 5);

  const createUser = await pool.query(
    `
    INSERT INTO users(name, email, password)
    VALUES($1, $2, $3)
    RETURNING name, email, created_at
    `,
    [name, email, hashPassword],
  );

  // console.log(createUser, "createUser");

  //? RABBITMQ CONFIG's
  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  const channel = await connection.createChannel();

  const queueName = "user_register";

  await channel.assertQueue(queueName, { durable: true });

  const bufferMessage = Buffer.from(JSON.stringify({ event: queueName, data: createUser.rows[0] }));

  channel.sendToQueue(queueName, bufferMessage);

  setTimeout(async () => {
    await connection.close();
    console.log(`Connection Closed ${queueName}`);
  }, 500);

  return res.status(200).json({
    success: true,
    message: "User Registered successfully!",
  });
});

export const loginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const isUserRegistered = await pool.query(
    `
    SELECT * FROM users
    WHERE email=$1
    `,
    [email],
  );

  // console.log("isUsersReg", isUserRegistered);

  if (isUserRegistered.rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: "User not registered!",
    });
  }

  const loginUser = isUserRegistered.rows[0];
  // console.log("LOGIN", loginUser);

  const isPasswordValid = bcrypt.compare(password, loginUser.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email or Password!",
    });
  }

  const token = jwt.sign({ id: loginUser.id, email: loginUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

  // console.log("TOK", token);

  res.cookie("accessToken", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" }); // 86400000

  return res.status(200).json({
    success: true,
    message: "Login Success!",
    user: { id: loginUser.id, name: loginUser.name, email: loginUser.email },
  });
});

export const logoutUser = AsyncHandler(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout Success!",
  });
});
