import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import User from "../users/users.model.js";
import RefreshToken from "./refreshToken.model.js";

class AuthService {
  async register(userData) {
    const { username, email, password } = userData;

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("Email hoặc username đã tồn tại");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Revoke all existing refresh tokens for this user (token rotation)
    await RefreshToken.update(
      { revoked: true, revoked_at: new Date() },
      { where: { user_id: user.id, revoked: false } }
    );

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshAccessToken(refreshToken) {
    // Find refresh token
    const tokenRecord = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        revoked: false,
        expires_at: { [Op.gt]: new Date() },
      },
      include: [{ model: User, as: "user" }],
    });

    if (!tokenRecord) {
      throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
    }

    // Revoke old refresh token (token rotation)
    await tokenRecord.update({
      revoked: true,
      revoked_at: new Date(),
    });

    // Generate new tokens
    const tokens = await this.generateTokens(tokenRecord.user_id);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken) {
    // Revoke refresh token
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken, revoked: false },
    });

    if (tokenRecord) {
      await tokenRecord.update({
        revoked: true,
        revoked_at: new Date(),
      });
    }

    return true;
  }

  async logoutAll(userId) {
    // Revoke all refresh tokens for user
    await RefreshToken.update(
      { revoked: true, revoked_at: new Date() },
      { where: { user_id: userId, revoked: false } }
    );

    return true;
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    return user.toJSON();
  }

  async generateTokens(userId) {
    // Generate access token (short-lived: 15 minutes)
    const accessToken = jwt.sign(
      { userId, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
    );

    // Generate refresh token (long-lived: 7 days)
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || 7)
    );

    // Save refresh token to database
    await RefreshToken.create({
      user_id: userId,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  generateToken(userId) {
    // Legacy method - kept for backward compatibility if needed
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  }
}

export default new AuthService();
