import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js';
import commentRoutes from "./routes/comment.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { verifyToken } from './utils/verifyUser.js';

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174', 
      'https://trendsphere-first.onrender.com',
      'https://trendsphere-first.onrender.com/',
      'https://trendsphere-second.onrender.com',
      'https://trendsphere-second.onrender.com/'
    ];
    
    console.log('CORS check for origin:', origin);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie']
}));

// Handle preflight requests
app.options('*', cors());

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

// Cookie test route
app.get("/api/test-cookies", (req, res) => {
  console.log('=== COOKIE TEST ===');
  console.log('All cookies:', req.cookies);
  console.log('Access token:', req.cookies.access_token);
  console.log('Headers:', req.headers);
  
  res.status(200).json({ 
    success: true, 
    message: "Cookie test",
    cookies: req.cookies,
    hasAccessToken: !!req.cookies.access_token,
    headers: req.headers
  });
});

// Auth test route
app.get("/api/test-auth", verifyToken, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Authentication working",
    user: req.user
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.status(200).json({ 
      success: true, 
      message: "Database connection test",
      dbState: states[dbState],
      readyState: dbState
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Database test failed",
      error: error.message 
    });
  }
});

// Debug route to check all registered routes
app.get("/api/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes });
});

// Catch-all route for debugging
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method
  });
});

// Error handling middleware (✔️ Fixed)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Error details:", {
    statusCode,
    message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
