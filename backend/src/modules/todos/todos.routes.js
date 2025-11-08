import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./todos.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { todoValidator } from "../../utils/validators.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.post("/", todoValidator, createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
