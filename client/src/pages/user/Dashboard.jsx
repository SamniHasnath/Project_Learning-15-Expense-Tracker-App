import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import TransactionList from "../../components/TransactionList";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [budgets, setBudgets] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, budgetsRes, txRes] = await Promise.all([
          api.get("/transactions/summary"),
          api.get("/budgets"),
          api.get("/transactions"),
        ]);
        setSummary(summaryRes.data);
        setBudgets(budgetsRes.data);
        setRecent(txRes.data.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total Income" value={`$${summary.totalIncome.toLocaleString()}`} color="#22c55e" />
        <StatCard label="Total Expenses" value={`$${summary.totalExpense.toLocaleString()}`} color="#ef4444" />
        <StatCard
          label="Current Balance"
          value={`$${summary.balance.toLocaleString()}`}
          color={summary.balance >= 0 ? "#22c55e" : "#ef4444"}
        />
        <StatCard
          label="Monthly Budget"
          value={`$${totalBudget.toLocaleString()}`}
          hint={`$${totalSpent.toLocaleString()} spent this month`}
        />
      </div>

      <div className="card">
        <h3 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>Recent Transactions</h3>
        <TransactionList transactions={recent} />
      </div>
    </div>
  );
}
