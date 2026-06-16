import { useEffect, useState } from "react";
import api from "../../api/axios";
import CategoryPieChart from "../../components/charts/CategoryPieChart";
import MonthlyBarChart from "../../components/charts/MonthlyBarChart";
import TransactionList from "../../components/TransactionList";
import { exportTransactionsPdf } from "../../utils/exportPdf";
import { exportTransactionsExcel } from "../../utils/exportExcel";

export default function Reports() {
  const [summary, setSummary] = useState({ monthly: [], categoryBreakdown: [] });
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transactions/summary").then((res) => setSummary(res.data));
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const params = {};
    if (type) params.type = type;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const res = await api.get("/transactions", { params });
    setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, startDate, endDate]);

  return (
    <div>
      <div className="main-grid">
        <CategoryPieChart data={summary.categoryBreakdown} title="Expenses by Category" />
        <MonthlyBarChart data={summary.monthly} title="Income vs Expense (Last 6 Months)" />
      </div>

      <div className="card" style={{ marginTop: "30px" }}>
        <div className="card-header">
          <h3 style={{ color: "var(--text-primary)" }}>Transaction History</h3>
          <div className="form-actions">
            <button className="btn-ghost" onClick={() => exportTransactionsPdf(transactions)}>
              Export PDF
            </button>
            <button className="btn-ghost" onClick={() => exportTransactionsExcel(transactions)}>
              Export Excel
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        {loading ? (
          <div className="page-loading">Loading...</div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
