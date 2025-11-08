import { Op } from "sequelize";
import Todo from "./todos.model.js";

class TodosService {
  async getAllTodos(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      completed = null,
      userId = null,
      isAdmin = false,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (!isAdmin && userId) {
      where.user_id = userId;
    }

    if (completed !== null) {
      where.completed = completed;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: todos, count: total } = await Todo.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return {
      todos: todos.map((todo) => todo.toJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTodoById(id, userId, isAdmin) {
    const where = { id };

    if (!isAdmin && userId) {
      where.user_id = userId;
    }

    const todo = await Todo.findOne({ where });

    if (!todo) {
      throw new Error("Todo không tồn tại hoặc bạn không có quyền");
    }

    return todo.toJSON();
  }

  async createTodo(todoData) {
    const { userId, title, description, completed = false } = todoData;

    const todo = await Todo.create({
      user_id: userId,
      title,
      description,
      completed,
    });

    return todo.toJSON();
  }

  async updateTodo(id, updateData, userId, isAdmin) {
    const where = { id };

    if (!isAdmin && userId) {
      where.user_id = userId;
    }

    // Check if todo exists and user has permission
    const todo = await Todo.findOne({ where });
    if (!todo) {
      throw new Error("Todo không tồn tại hoặc bạn không có quyền");
    }

    // Update todo
    await todo.update(updateData);
    await todo.reload();

    return todo.toJSON();
  }

  async deleteTodo(id, userId, isAdmin) {
    const where = { id };

    if (!isAdmin && userId) {
      where.user_id = userId;
    }

    // Check if todo exists and user has permission
    const todo = await Todo.findOne({ where });
    if (!todo) {
      throw new Error("Todo không tồn tại hoặc bạn không có quyền");
    }

    await todo.destroy();
    return true;
  }
}

export default new TodosService();
