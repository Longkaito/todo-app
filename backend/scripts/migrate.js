import sequelize from "../src/config/sequelize.js";
import { runMigrations } from "../src/database/migrations.js";

async function migrate() {
  try {
    await runMigrations();
    await sequelize.close();
    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
