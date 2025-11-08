import UsersService from "./users.service.js";
import { success, created, error, notFound, conflict, badRequest } from "../../utils/response.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await UsersService.getAllUsers({ page, limit, search });
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UsersService.getUserById(id);
    return success(res, { user });
  } catch (err) {
    if (err.message === "User không tồn tại") {
      return notFound(res, err.message);
    }
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = "user" } = req.body;
    const user = await UsersService.createUser({ username, email, password, role });
    return created(res, { user }, "Tạo user thành công");
  } catch (err) {
    if (err.message === "Email hoặc username đã tồn tại") {
      return conflict(res, err.message);
    }
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    const user = await UsersService.updateUser(id, { username, email, password, role });
    return success(res, { user }, "Cập nhật user thành công");
  } catch (err) {
    if (err.message === "User không tồn tại") {
      return notFound(res, err.message);
    }
    if (err.message === "Email hoặc username đã được sử dụng") {
      return conflict(res, err.message);
    }
    if (err.message === "Không có dữ liệu để cập nhật") {
      return badRequest(res, err.message);
    }
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await UsersService.deleteUser(id, req.user.id);
    return success(res, null, "Xóa user thành công");
  } catch (err) {
    if (err.message === "Không thể xóa chính mình") {
      return badRequest(res, err.message);
    }
    if (err.message === "User không tồn tại") {
      return notFound(res, err.message);
    }
    next(err);
  }
};
