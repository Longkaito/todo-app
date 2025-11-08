import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getProfile,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.js";
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} from "../../utils/validators.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refreshTokenValidator, refreshToken);
router.post("/logout", refreshTokenValidator, logout);
router.post("/logout-all", authenticate, logoutAll);
router.get("/profile", authenticate, getProfile);

export default router;
