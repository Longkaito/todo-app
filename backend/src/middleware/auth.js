import jwt from "jsonwebtoken";
import User from "../modules/users/users.model.js";
import { unauthorized, forbidden } from "../utils/response.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return unauthorized(res, "Token không được cung cấp");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId, {
      attributes: ["id", "username", "email", "role"],
    });

    if (!user) {
      return unauthorized(res, "User không tồn tại");
    }

    req.user = user.toJSON();
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return unauthorized(res, "Token không hợp lệ");
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token đã hết hạn. Vui lòng refresh token.",
        code: "TOKEN_EXPIRED",
        requiresRefresh: true,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
      error: err.message,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, "Chưa xác thực");
    }

    if (!roles.includes(req.user.role)) {
      return forbidden(res, "Không có quyền truy cập");
    }

    next();
  };
};
