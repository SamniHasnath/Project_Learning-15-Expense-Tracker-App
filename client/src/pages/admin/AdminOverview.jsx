import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";

export default function AdminOverview() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get("/admin/overview").then((res) => setOverview(res.data));
  }, []);

  if (!overview) return <div className="page-loading">Loading...</div>;

  return (
    <div className="stats-grid">
      <StatCard label="Total Users" value={overview.totalUsers} />
      <StatCard label="Active Users" value={overview.activeUsers} color="#22c55e" />
      <StatCard label="New Users This Month" value={overview.newUsersThisMonth} />
      <StatCard label="Total Transactions" value={overview.totalTransactions} />
      <StatCard
        label="Total Income Recorded"
        value={`$${overview.totalIncome.toLocaleString()}`}
        color="#22c55e"
      />
      <StatCard
        label="Total Expenses Recorded"
        value={`$${overview.totalExpense.toLocaleString()}`}
        color="#ef4444"
      />
    </div>
  );
}
