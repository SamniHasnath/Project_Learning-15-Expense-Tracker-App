const jwt = require("jsonwebtoken");
const pool = require("../db");

// Verifies the JWT and re-checks the user's role/status from the DB so a
// blocked or deleted user is locked out immediately, not just at login.
async function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, name, email, role, status FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ error: "Your account has been blocked" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
