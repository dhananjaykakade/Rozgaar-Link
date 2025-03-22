import express from "express";
import { httpLogger } from "./utils/logger.js";
import routes from "./routes/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(httpLogger);

console.log("📌 API Routes: /api/auth/send-otp, /api/auth/verify-otp");

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Handle 404 Errors
app.use((req, res, next) => {
  next(new CustomError("Route Not Found", 404));
});
app.use(errorMiddleware);

export default app;
