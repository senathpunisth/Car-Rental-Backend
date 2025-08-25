import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all cars
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Cars");
  res.json(rows);
});

// Add new car
router.post("/", async (req, res) => {
  try {
    const { car_make, car_model, year, registration_no, seats, price_per_day, branch_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Cars (car_make, car_model, year, registration_no, seats, price_per_day, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [car_make, car_model, year, registration_no, seats, price_per_day, branch_id]
    );
    res.json({ success: true, car_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
