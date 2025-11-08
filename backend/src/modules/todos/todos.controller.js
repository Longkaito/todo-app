import TodosService from "./todos.service.js";
import { success, created, notFound, badRequest } from "../../utils/response.js";

export const getAllTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, completed, search = "" } = req.query;
    const isAdmin = req.user.role === "admin";

    const result = await TodosService.getAllTodos({
      page,
      limit,
      completed: completed !== undefined ? completed === "true" : null,
      search,
      userId: req.user.id,
      isAdmin,
    });

    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";
    const todo = await TodosService.getTodoById(id, req.user.id, isAdmin);
    return success(res, { todo });
  } catch (err) {
    if (err.message === "Todo không tồn tại hoặc bạn không có quyền") {
      return notFound(res, err.message);
    }
    next(err);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title, description, completed = false } = req.body;
    const todo = await TodosService.createTodo({
      userId: req.user.id,
      title,
      description,
      completed,
    });
    return created(res, { todo }, "Tạo todo thành công");
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const isAdmin = req.user.role === "admin";

    const todo = await TodosService.updateTodo(
      id,
      { title, description, completed },
      req.user.id,
      isAdmin
    );

    return success(res, { todo }, "Cập nhật todo thành công");
  } catch (err) {
    if (err.message === "Todo không tồn tại hoặc bạn không có quyền") {
      return notFound(res, err.message);
    }
    if (err.message === "Không có dữ liệu để cập nhật") {
      return badRequest(res, err.message);
    }
    next(err);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";
    await TodosService.deleteTodo(id, req.user.id, isAdmin);
    return success(res, null, "Xóa todo thành công");
  } catch (err) {
    if (err.message === "Todo không tồn tại hoặc bạn không có quyền") {
      return notFound(res, err.message);
    }
    next(err);
  }
};
