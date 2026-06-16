const pool = require("../db");

const VALID_TYPES = ["income", "expense"];

async function getTransactions(req, res) {
  try {
    const { type, category, startDate, endDate } = req.query;
    const conditions = ["user_id = $1"];
    const params = [req.user.id];

    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (startDate) {
      params.push(startDate);
      conditions.push(`date >= $${params.length}`);
    }
    if (endDate) {
      params.push(endDate);
      conditions.push(`date <= $${params.length}`);
    }

    const result = await pool.query(
      `SELECT * FROM transactions WHERE ${conditions.join(" AND ")} ORDER BY date DESC, id DESC`,
      params
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTransaction(req, res) {
  try {
    const { type, title, category, amount, date } = req.body;

    if (!type || !title || !category || !amount) {
      return res.status(400).json({ error: "type, title, category and amount are required" });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "type must be 'income' or 'expense'" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "amount must be greater than 0" });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, title, category, amount, date)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE))
       RETURNING *`,
      [req.user.id, type, title, category, amount, date || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { title, category, amount, date } = req.body;

    if (!title || !category || !amount) {
      return res.status(400).json({ error: "title, category and amount are required" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "amount must be greater than 0" });
    }

    const result = await pool.query(
      `UPDATE transactions SET title = $1, category = $2, amount = $3, date = COALESCE($4, date)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, category, amount, date || null, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Totals + last-6-months income/expense series for dashboard & report charts.
async function getSummary(req, res) {
  try {
    const totalsResult = await pool.query(
      `SELECT type, COALESCE(SUM(amount), 0) AS total
       FROM transactions WHERE user_id = $1 GROUP BY type`,
      [req.user.id]
    );

    let totalIncome = 0;
    let totalExpense = 0;
    totalsResult.rows.forEach((row) => {
      if (row.type === "income") totalIncome = Number(row.total);
      if (row.type === "expense") totalExpense = Number(row.total);
    });

    const monthlyResult = await pool.query(
      `SELECT to_char(date, 'YYYY-MM') AS month, type, COALESCE(SUM(amount), 0) AS total
       FROM transactions
       WHERE user_id = $1 AND date >= (CURRENT_DATE - INTERVAL '5 months')
       GROUP BY month, type
       ORDER BY month`,
      [req.user.id]
    );

    const categoryResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) AS total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY category
       ORDER BY total DESC`,
      [req.user.id]
    );

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthly: monthlyResult.rows,
      categoryBreakdown: categoryResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
