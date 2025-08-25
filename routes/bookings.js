import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create booking
router.post("/", async (req, res) => {
  try {
    const { user_id, car_id, start_date, end_date, total_price } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Bookings (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
      [user_id, car_id, start_date, end_date, total_price]
    );
    res.json({ success: true, booking_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT b.*, u.full_name, c.car_make, c.car_model FROM Bookings b JOIN Users u ON b.user_id = u.user_id JOIN Cars c ON b.car_id = c.car_id"
  );
  res.json(rows);
});

export default router;
