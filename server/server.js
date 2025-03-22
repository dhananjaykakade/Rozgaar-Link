import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import config from "./src/config/config.js";
import process from "process"; // Explicitly import process for ESM
import dotenv from "dotenv";

dotenv.config(); // Ensure .env variables are loaded

const { PORT } = config;
let server;

// Start server with error handling
const startServer = () => {
  try {
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
const shutdown = (signal) => {
  logger.warn(`🛑 Received ${signal}, shutting down gracefully...`);
  if (server) {
    server.close(() => {
      logger.info("✅ Server closed. Exiting process...");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
