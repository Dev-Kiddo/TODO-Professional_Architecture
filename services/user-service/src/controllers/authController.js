import pool from "../config/dbConfig.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const registerUser = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await pool.query(
    `
    SELECT email from USERS WHERE email=$1
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
    `,
    [name, email, hashPassword],
  );

  // console.log(createUser, "createUser");

  return res.status(200).json({
    success: true,
    message: "User Registered successfully!",
  });
});

export const loginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const isUserRegistered = await pool.query(
    `
    SELECT email, password FROM users
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

  const isPasswordValid = bcrypt.compare(password, loginUser.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email or Password!",
    });
  }

  const token = jwt.sign({ email: loginUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("accessToken", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true }); // 86400000

  return res.status(200).json({
    success: true,
    message: "Login Success!",
  });
});

export const logoutUser = AsyncHandler(async (req, res, next) => {
  res.clearCookie("accessToken");

  return res.status(200).json({
    success: true,
    message: "Logout Success!",
  });
});
