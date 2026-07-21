import express from "express";
import { getCurrentUser, getUser, getUsers, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { protectAuth } from "../middlewares/protectAuth.js";

const router = express.Router();

router.route("/users").get(protectAuth, getUsers).get(protectAuth, getCurrentUser);
router.route("/users/:id").get(protectAuth, getUser);

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/logout").get(logoutUser);

export default router;
