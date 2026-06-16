import { useEffect, useState } from "react";
import api from "../api/axios";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ type, categories, editingTransaction, onSaved, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date?.slice(0, 10) || todayISO());
    } else {
      setTitle("");
      setAmount("");
      setCategory(categories[0]);
      setDate(todayISO());
    }
  }, [editingTransaction, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setSaving(true);

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, { title, amount, category, date });
      } else {
        await api.post("/transactions", { type, title, amount, category, date });
      }
      setTitle("");
      setAmount("");
      setCategory(categories[0]);
      setDate(todayISO());
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

      <input
        placeholder={type === "income" ? "Source (e.g. Salary)" : "What did you spend on?"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <div className="form-actions">
        <button className="btn-add" type="submit" disabled={saving}>
          {editingTransaction ? "Update" : "Add"} {type === "income" ? "Income" : "Expense"}
        </button>
        {editingTransaction && (
          <button type="button" className="btn-ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
