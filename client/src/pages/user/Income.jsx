import { useEffect, useState } from "react";
import api from "../../api/axios";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import { INCOME_CATEGORIES } from "../../utils/categories";

export default function Income() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const res = await api.get("/transactions", { params: { type: "income" } });
    setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    refresh();
  };

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="main-grid">
      <div className="card">
        <h3 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>
          {editing ? "Edit Income" : "Add Income"}
        </h3>
        <TransactionForm
          type="income"
          categories={INCOME_CATEGORIES}
          editingTransaction={editing}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
          onCancelEdit={() => setEditing(null)}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 style={{ color: "var(--text-primary)" }}>Income History</h3>
          <span className="amount amount-income">Total: ${total.toLocaleString()}</span>
        </div>
        {loading ? (
          <div className="page-loading">Loading...</div>
        ) : (
          <TransactionList transactions={transactions} onEdit={setEditing} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
