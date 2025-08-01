import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js';
import commentRoutes from "./routes/comment.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173','https://trendsphere-5.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Test route (optional, for debugging)
app.get("/api/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working properly" });
});

// Error handling middleware (✔️ Fixed)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
