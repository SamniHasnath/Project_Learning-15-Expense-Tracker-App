const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  try {
    await pool.query(sql);
    console.log("Database schema created successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
