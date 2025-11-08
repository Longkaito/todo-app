import sequelize from "../config/sequelize.js";
import User from "../modules/users/users.model.js";
import Todo from "../modules/todos/todos.model.js"; //import for creating table todos
import RefreshToken from "../modules/auth/refreshToken.model.js"; //import for creating table refresh_tokens
import bcrypt from "bcryptjs";

export async function runMigrations() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    // Sync models (create tables if not exist)
    await sequelize.sync({ alter: false });
    console.log("✅ Database tables synced");

    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { role: "admin" } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log(
        "✅ Default admin user created (username: admin, password: admin123)"
      );
    }

    console.log("✅ Database migrations completed");
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  }
}
