import cors from "cors";
import express from "express";
import morgan from "morgan";

import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

/**
 * Middleware
 */
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean,
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/**
 * Health Check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Attendance Management API is running",
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * Global Error Handler
 */
app.use((error, _req, res, _next) => {
  console.error("Server Error:", error);

  res.status(error.statusCode || error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
});

export default app;
