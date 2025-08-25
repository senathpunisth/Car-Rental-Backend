import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create payment
router.post("/", async (req, res) => {
  try {
    const { booking_id, amount, payment_method } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Payments (booking_id, amount, payment_method, status) VALUES (?, ?, ?, 'success')",
      [booking_id, amount, payment_method]
    );
    res.json({ success: true, payment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all payments
router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT p.*, b.start_date, b.end_date, u.full_name FROM Payments p JOIN Bookings b ON p.booking_id = b.booking_id JOIN Users u ON b.user_id = u.user_id"
  );
  res.json(rows);
});

export default router;
