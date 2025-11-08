import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { authorize } from "../../middleware/auth.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../../utils/validators.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUserValidator, createUser);
router.put("/:id", updateUserValidator, updateUser);
router.delete("/:id", deleteUser);

export default router;
