import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "CarRental",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection function (don't call it here)
export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL database successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

export default db;