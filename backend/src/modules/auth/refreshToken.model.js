import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";
import User from "../users/users.model.js";

const RefreshToken = sequelize.define(
  "RefreshToken",
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["token"],
        name: "idx_refresh_tokens_token",
      },
      {
        fields: ["user_id"],
        name: "idx_refresh_tokens_user_id",
      },
      {
        fields: ["revoked"],
        name: "idx_refresh_tokens_revoked",
      },
      {
        fields: ["expires_at"],
        name: "idx_refresh_tokens_expires_at",
      },
      {
        fields: ["token", "revoked", "expires_at"],
        name: "idx_refresh_tokens_verify",
      },
      {
        fields: ["user_id", "revoked"],
        name: "idx_refresh_tokens_user_revoked",
      },
    ],
  }
);

// Define associations
RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });

export default RefreshToken;
