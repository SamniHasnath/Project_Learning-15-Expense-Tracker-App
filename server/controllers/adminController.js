const pool = require("../db");

async function getOverview(req, res) {
  try {
    const [usersCount, activeCount, newUsersCount, txCount, totalsResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM users WHERE status = 'active'"),
      pool.query(
        `SELECT COUNT(*) FROM users
         WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)`
      ),
      pool.query("SELECT COUNT(*) FROM transactions"),
      pool.query(
        `SELECT type, COALESCE(SUM(amount), 0) AS total
         FROM transactions GROUP BY type`
      ),
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    totalsResult.rows.forEach((row) => {
      if (row.type === "income") totalIncome = Number(row.total);
      if (row.type === "expense") totalExpense = Number(row.total);
    });

    res.json({
      totalUsers: Number(usersCount.rows[0].count),
      activeUsers: Number(activeCount.rows[0].count),
      newUsersThisMonth: Number(newUsersCount.rows[0].count),
      totalTransactions: Number(txCount.rows[0].count),
      totalIncome,
      totalExpense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUsers(req, res) {
  try {
    const { search } = req.query;
    const conditions = ["role = 'user'"];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
    }

    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at FROM users
       WHERE ${conditions.join(" AND ")}
       ORDER BY created_at DESC`,
      params
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ error: "status must be 'active' or 'blocked'" });
    }

    const result = await pool.query(
      `UPDATE users SET status = $1 WHERE id = $2 AND role = 'user'
       RETURNING id, name, email, role, status, created_at`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role = 'user' RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllTransactions(req, res) {
  try {
    const { userId, category, type, startDate, endDate } = req.query;
    const conditions = ["1=1"];
    const params = [];

    if (userId) {
      params.push(userId);
      conditions.push(`t.user_id = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`t.category = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`t.type = $${params.length}`);
    }
    if (startDate) {
      params.push(startDate);
      conditions.push(`t.date >= $${params.length}`);
    }
    if (endDate) {
      params.push(endDate);
      conditions.push(`t.date <= $${params.length}`);
    }

    const result = await pool.query(
      `SELECT t.*, u.name AS user_name, u.email AS user_email
       FROM transactions t
       JOIN users u ON u.id = t.user_id
       WHERE ${conditions.join(" AND ")}
       ORDER BY t.date DESC, t.id DESC
       LIMIT 500`,
      params
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAnalytics(req, res) {
  try {
    const [incomeExpenseByMonth, categoryBreakdown, userGrowth] = await Promise.all([
      pool.query(
        `SELECT to_char(date, 'YYYY-MM') AS month, type, COALESCE(SUM(amount), 0) AS total
         FROM transactions
         WHERE date >= (CURRENT_DATE - INTERVAL '11 months')
         GROUP BY month, type
         ORDER BY month`
      ),
      pool.query(
        `SELECT category, COALESCE(SUM(amount), 0) AS total
         FROM transactions
         WHERE type = 'expense'
         GROUP BY category
         ORDER BY total DESC`
      ),
      pool.query(
        `SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*) AS count
         FROM users
         WHERE role = 'user' AND created_at >= (CURRENT_DATE - INTERVAL '11 months')
         GROUP BY month
         ORDER BY month`
      ),
    ]);

    res.json({
      incomeExpenseByMonth: incomeExpenseByMonth.rows,
      categoryBreakdown: categoryBreakdown.rows.map((row) => ({
        category: row.category,
        total: Number(row.total),
      })),
      userGrowth: userGrowth.rows.map((row) => ({
        month: row.month,
        count: Number(row.count),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getOverview,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAllTransactions,
  getAnalytics,
};
