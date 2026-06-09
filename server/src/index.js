import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/attendance_management";

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");
console.log("📦 Database:", mongoose.connection.name);
console.log("🌐 Host:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

/**
 * Graceful shutdown
 */
process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  await mongoose.connection.close();

  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");

  await mongoose.connection.close();

  process.exit(0);
});