import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/users.js";
import carRoutes from "./routes/cars.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import { testConnection } from "./config/db.js"; // Import the test function

const app = express();

// Simple request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration - allow requests from your frontend
const allowedOrigins = [
  process.env.FRONTEND_URL, // may be undefined
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));

app.use(express.json());

// Serve the connection test page
app.get("/test-db", (req, res) => {
  res.sendFile(process.cwd() + "/db-test.html");
});

// Define your API base URL (for potential internal use)
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    message: "Car Rental API is running", 
    baseUrl: API_BASE_URL 
  });
});

// JSON 404 for /api/*
app.use("/api", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global JSON error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// Database connection test endpoint
app.get("/api/test-connection", async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ 
        success: true, 
        message: 'Database connection successful!' 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Database connection failed.' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error testing database connection',
      error: error.message 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Car Rental Backend running on port ${PORT}`);
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`📊 Database test page: http://localhost:${PORT}/test-db`);
});