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

// `data` is an array of { month: 'YYYY-MM', type: 'income'|'expense', total }
export default function MonthlyBarChart({ data, title = "Income vs Expense" }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const textPrimary = isLight ? "#0f172a" : "#f8fafc";
  const textSecondary = isLight ? "#52606d" : "#94a3b8";
  const gridColor = isLight ? "rgba(15, 23, 42, 0.06)" : "rgba(255, 255, 255, 0.05)";

  const months = [...new Set(data.map((d) => d.month))].sort();

  const incomeByMonth = months.map((month) => {
    const row = data.find((d) => d.month === month && d.type === "income");
    return row ? Number(row.total) : 0;
  });

  const expenseByMonth = months.map((month) => {
    const row = data.find((d) => d.month === month && d.type === "expense");
    return row ? Number(row.total) : 0;
  });

  const totalIncome = incomeByMonth.reduce((sum, v) => sum + v, 0);
  const totalExpense = expenseByMonth.reduce((sum, v) => sum + v, 0);
  const net = totalIncome - totalExpense;

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeByMonth,
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        hoverBackgroundColor: "rgba(34, 197, 94, 0.95)",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 60,
      },
      {
        label: "Expense",
        data: expenseByMonth,
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        hoverBackgroundColor: "rgba(239, 68, 68, 0.95)",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    categoryPercentage: 0.5,
    barPercentage: 0.9,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textPrimary, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { ticks: { color: textSecondary }, grid: { color: gridColor } },
      y: {
        ticks: { color: textSecondary, callback: (value) => `$${value.toLocaleString()}` },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="chart-box">
      <h3>{title}</h3>
      {months.length > 0 ? (
        <>
          <div className="chart-canvas">
            <Bar data={chartData} options={options} />
          </div>
          <div className="chart-legend">
            <div className="chart-legend-item">
              <span className="chart-legend-dot" style={{ background: "rgba(34, 197, 94, 0.9)" }} />
              <span className="chart-legend-label">Total Income</span>
              <span className="chart-legend-value">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="chart-legend-item">
              <span className="chart-legend-dot" style={{ background: "rgba(239, 68, 68, 0.9)" }} />
              <span className="chart-legend-label">Total Expense</span>
              <span className="chart-legend-value">${totalExpense.toLocaleString()}</span>
            </div>
            <div className="chart-legend-item">
              <span
                className="chart-legend-dot"
                style={{ background: net >= 0 ? "rgba(99, 102, 241, 0.9)" : "rgba(245, 158, 11, 0.9)" }}
              />
              <span className="chart-legend-label">Net Savings</span>
              <span className="chart-legend-value">
                {net < 0 && "-"}${Math.abs(net).toLocaleString()}
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className="empty-state">No data to display yet.</p>
      )}
    </div>
  );
}
