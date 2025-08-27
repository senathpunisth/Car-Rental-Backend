import express from "express";
import pool from "../db.js";
import { registerUser } from "../controllers/userController.js";

const user = express.Router();

user.post("/register", registerUser);
user.post("/login", loginUser);



export default router;
