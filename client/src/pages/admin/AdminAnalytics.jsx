import { useEffect, useState } from "react";
import api from "../../api/axios";
import CategoryPieChart from "../../components/charts/CategoryPieChart";
import MonthlyBarChart from "../../components/charts/MonthlyBarChart";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function UserGrowthChart({ data }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const textPrimary = isLight ? "#0f172a" : "#f8fafc";
  const textSecondary = isLight ? "#52606d" : "#94a3b8";
  const gridColor = isLight ? "rgba(15, 23, 42, 0.06)" : "rgba(255, 255, 255, 0.05)";

  const months = data.map((d) => d.month);
  const counts = data.map((d) => d.count);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "New Users",
        data: counts,
        backgroundColor: "rgba(249, 115, 22, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { color: textPrimary } } },
    scales: {
      x: { ticks: { color: textSecondary }, grid: { color: gridColor } },
      y: { ticks: { color: textSecondary }, grid: { color: gridColor }, beginAtZero: true },
    },
  };

  return (
    <div className="chart-box">
      <h3>User Growth</h3>
      {months.length > 0 ? (
        <div className="chart-canvas">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="empty-state">No data to display yet.</p>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data));
  }, []);

  if (!analytics) return <div className="page-loading">Loading...</div>;

  return (
    <div className="main-grid">
      <MonthlyBarChart data={analytics.incomeExpenseByMonth} title="Income vs Expense (All Users)" />
      <CategoryPieChart data={analytics.categoryBreakdown} title="Category-wise Expenses (All Users)" />
      <UserGrowthChart data={analytics.userGrowth} />
    </div>
  );
}
