const bcrypt = require("bcryptjs");
const pool = require("../db");

async function seed() {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existing.rows.length > 0) {
      console.log(`Admin account already exists for ${email}.`);
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, 'admin', 'active')",
      [name, email, hashed]
    );

    console.log(`Admin account created: ${email} / ${password}`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
