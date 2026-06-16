const pool = require("../db");

// Returns this user's budgets for the given month/year (defaults to current),
// each annotated with how much has been spent in that category so far.
async function getBudgets(req, res) {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgetsResult = await pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 AND month = $2 AND year = $3 ORDER BY category",
      [req.user.id, month, year]
    );

    const spentResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) AS spent
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
         AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3
       GROUP BY category`,
      [req.user.id, month, year]
    );

    const spentByCategory = {};
    spentResult.rows.forEach((row) => {
      spentByCategory[row.category] = Number(row.spent);
    });

    const budgets = budgetsResult.rows.map((budget) => {
      const spent = spentByCategory[budget.category] || 0;
      const amount = Number(budget.amount);
      return {
        ...budget,
        amount,
        spent,
        remaining: amount - spent,
        exceeded: spent > amount,
      };
    });

    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Creates or updates the budget for a category/month/year (upsert).
async function upsertBudget(req, res) {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({ error: "category, amount, month and year are required" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "amount must be greater than 0" });
    }

    const result = await pool.query(
      `INSERT INTO budgets (user_id, category, amount, month, year)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, category, month, year)
       DO UPDATE SET amount = EXCLUDED.amount
       RETURNING *`,
      [req.user.id, category, amount, month, year]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteBudget(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getBudgets, upsertBudget, deleteBudget };
