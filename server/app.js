import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Database Connection

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
// Default Route
const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Error in starting the server", err);
  }
};

startServer();

export default app;
