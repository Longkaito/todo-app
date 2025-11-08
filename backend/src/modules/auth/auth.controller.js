import AuthService from "./auth.service.js";
import {
  success,
  created,
  error,
  unauthorized,
  notFound,
} from "../../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await AuthService.register({ username, email, password });
    return created(res, result, "Đăng ký thành công");
  } catch (err) {
    if (err.message === "Email hoặc username đã tồn tại") {
      return error(res, err.message, 409);
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    return success(res, result, "Đăng nhập thành công");
  } catch (err) {
    if (err.message === "Email hoặc mật khẩu không đúng") {
      return unauthorized(res, err.message);
    }
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return error(res, "Refresh token không được cung cấp", 400);
    }
    const result = await AuthService.refreshAccessToken(refreshToken);
    return success(res, result, "Refresh token thành công");
  } catch (err) {
    if (err.message === "Refresh token không hợp lệ hoặc đã hết hạn") {
      return unauthorized(res, err.message);
    }
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return error(res, "Refresh token không được cung cấp", 400);
    }
    await AuthService.logout(refreshToken);
    return success(res, null, "Đăng xuất thành công");
  } catch (err) {
    next(err);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    await AuthService.logoutAll(req.user.id);
    return success(res, null, "Đăng xuất tất cả thiết bị thành công");
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    return success(res, { user });
  } catch (err) {
    if (err.message === "User không tồn tại") {
      return notFound(res, err.message);
    }
    next(err);
  }
};
