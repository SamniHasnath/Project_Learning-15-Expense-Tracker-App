import { useState } from "react";
import api from "../api/axios";
import { EXPENSE_CATEGORIES } from "../utils/categories";

export default function BudgetForm({ month, year, onSaved }) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) {
      setError("Please enter a budget amount");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await api.post("/budgets", { category, amount, month, year });
      setAmount("");
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {EXPENSE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Monthly budget amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="btn-add" type="submit" disabled={saving}>
        Set Budget
      </button>
    </form>
  );
}
