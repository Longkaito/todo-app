import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const maxRetries = 30;
const retryDelay = 2000; // 2 seconds

async function waitForDatabase() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || "todo_app",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
      retry: {
        max: maxRetries,
      },
    }
  );

  for (let i = 0; i < maxRetries; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established");
      await sequelize.close();
      process.exit(0);
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error(
          "❌ Failed to connect to database after",
          maxRetries,
          "attempts"
        );
        process.exit(1);
      }
      console.log(`⏳ Waiting for database... (${i + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

waitForDatabase();
