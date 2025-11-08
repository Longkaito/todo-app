import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import User from "../users/users.model.js";

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "todos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["user_id"],
        name: "idx_todos_user_id",
      },
      {
        fields: ["completed"],
        name: "idx_todos_completed",
      },
      {
        fields: ["created_at"],
        name: "idx_todos_created_at",
      },
      {
        fields: ["user_id", "completed"],
        name: "idx_todos_user_completed",
      },
      {
        fields: ["user_id", "created_at"],
        name: "idx_todos_user_created",
      },
    ],
  }
);

Todo.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Todo, { foreignKey: "user_id", as: "todos" });

export default Todo;
