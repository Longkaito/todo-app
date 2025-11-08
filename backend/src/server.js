import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/sequelize.js";
import { runMigrations } from "./database/migrations.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8999;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Đang tắt server...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Đang tắt server...");
  await sequelize.close();
  process.exit(0);
});

startServer();
