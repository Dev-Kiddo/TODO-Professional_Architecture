import express from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todoController.js";
import { protectAuth } from "../middlewares/protectAuth.js";

const router = express.Router();

router.route("/todos").get(protectAuth, getTodos).post(protectAuth, createTodo);
router.route("/todos/:id").patch(protectAuth, updateTodo).delete(protectAuth, deleteTodo);

export default router;
