import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        is: /^[a-zA-Z0-9_]+$/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["admin", "user"]],
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "idx_users_email",
      },
      {
        unique: true,
        fields: ["username"],
        name: "idx_users_username",
      },
      {
        fields: ["role"],
        name: "idx_users_role",
      },
      {
        fields: ["created_at"],
        name: "idx_users_created_at",
      },
      {
        fields: ["username", "email"],
        name: "idx_users_search",
      },
    ],
  }
);

export default User;
