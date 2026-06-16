// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json()); // Allows us to catch req.body as JSON

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/admin", adminRoutes);

// Test Route to ensure DB is connected
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database Connected!", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
