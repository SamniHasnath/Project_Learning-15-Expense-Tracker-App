require("dotenv").config();
const { Pool } = require("pg");

const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DB_URL || "");

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

module.exports = pool;
