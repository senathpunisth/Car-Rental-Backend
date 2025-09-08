// routes/users.js - Updated with all password reset functionality
import express from "express";
<<<<<<< Updated upstream
import pool from "../db.js";
import { registerUser } from "../controllers/userController.js";

const user = express.Router();

user.post("/register", registerUser);
user.post("/login", loginUser);


=======
import db from "../config/db.js"; 
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js"; // Your auth middleware (if you have one)

const user = express.Router();

// Existing routes
user.post("/register", registerUser);
user.post("/login", loginUser);
user.get("/profile", authenticateToken, getUserProfile);

// New password reset routes
user.post("/forgot-password", forgotPassword);
user.get("/verify-reset-token/:token", verifyResetToken);
user.post("/reset-password", resetPassword);
user.post("/change-password", authenticateToken, changePassword);
>>>>>>> Stashed changes

export default user;