import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- Root Route ----------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PeerNova Backend is running! 🚀",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      profile: "GET /api/users/profile",
    },
  });
});

// ---------------- API Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ---------------- Health Check ----------------
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is healthy!" });
});

// ---------------- Keep Render Alive ----------------
setInterval(() => {
  fetch("https://peernova.onrender.com/api/health").catch(() =>
    console.log("⚠️ Keep-alive ping failed")
  );
}, 5 * 60 * 1000); // Every 5 minutes

// ---------------- 404 Handler ----------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------------- Global Error Handler ----------------
app.use(errorHandler);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
