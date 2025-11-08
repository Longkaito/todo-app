import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import User from "./users.model.js";

class UsersService {
  async getAllUsers(options = {}) {
    const { page = 1, limit = 10, search = "" } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return {
      users: users.map((user) => user.toJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    return user.toJSON();
  }

  async createUser(userData) {
    const { username, email, password, role = "user" } = userData;

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
      role,
    });

    return user.toJSON();
  }

  async updateUser(id, updateData) {
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }

    // Check if email/username is taken by another user
    if (updateData.email || updateData.username) {
      const where = {
        id: { [Op.ne]: id },
      };

      if (updateData.email && updateData.username) {
        where[Op.or] = [
          { email: updateData.email },
          { username: updateData.username },
        ];
      } else if (updateData.email) {
        where.email = updateData.email;
      } else if (updateData.username) {
        where.username = updateData.username;
      }

      const duplicate = await User.findOne({ where });
      if (duplicate) {
        throw new Error("Email hoặc username đã được sử dụng");
      }
    }

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Update user
    await user.update(updateData);
    await user.reload();

    return user.toJSON();
  }

  async deleteUser(id, currentUserId) {
    // Prevent deleting yourself
    if (parseInt(id) === currentUserId) {
      throw new Error("Không thể xóa chính mình");
    }

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }

    await user.destroy();
    return true;
  }
}

export default new UsersService();
