import express from "express";
import pool from "../db.js";

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, phone, password_hash } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [full_name, email, phone, password_hash]
    );
    res.json({ success: true, user_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Users");
  res.json(rows);
});

export default router;
