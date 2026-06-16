import { useEffect, useState } from "react";
import api from "../../api/axios";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../utils/categories";

const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ userId: "", category: "", type: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data));
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    const res = await api.get("/admin/transactions", { params });
    setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ color: "var(--text-primary)" }}>All Transactions</h3>
      </div>

      <div className="filter-bar">
        <select value={filters.userId} onChange={(e) => updateFilter("userId", e.target.value)}>
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <select value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)}>
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input type="date" value={filters.startDate} onChange={(e) => updateFilter("startDate", e.target.value)} />
        <input type="date" value={filters.endDate} onChange={(e) => updateFilter("endDate", e.target.value)} />
      </div>

      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Type</th>
              <th>Category</th>
              <th>Title</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.user_name}</td>
                <td>
                  <span className={`badge badge-${t.type}`}>{t.type}</span>
                </td>
                <td>{t.category}</td>
                <td>{t.title}</td>
                <td className={t.type === "income" ? "amount-income" : "amount-expense"}>
                  {t.type === "income" ? "+" : "-"}${Number(t.amount).toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-state">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
