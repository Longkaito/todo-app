import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import todoRoutes from "../modules/todos/todos.routes.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/todos", todoRoutes);

export default router;
