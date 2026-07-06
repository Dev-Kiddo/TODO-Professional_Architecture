import AsyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const protectAuth = AsyncHandler(async function (req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(400).json({
      success: false,
      message: "No authorization token was found",
    });
  }

  const verifyToken = jwt.verify(accessToken, process.env.JWT_SECRET);

  if (!verifyToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token!",
    });
  }

  req.user = verifyToken;

  next();
});
