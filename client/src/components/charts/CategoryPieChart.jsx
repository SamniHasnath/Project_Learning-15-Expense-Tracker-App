import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CATEGORY_ICONS } from "../../utils/categories";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "rgba(99, 102, 241, 0.8)",
  "rgba(168, 85, 247, 0.8)",
  "rgba(244, 63, 94, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(59, 130, 246, 0.8)",
  "rgba(245, 158, 11, 0.8)",
  "rgba(236, 72, 153, 0.8)",
  "rgba(20, 184, 166, 0.8)",
];

// Draws the total amount in the center of the donut
function createCenterTotalPlugin(labelColor, valueColor) {
  return {
    id: "centerTotal",
    beforeDraw(chart) {
      const total = chart.config.data.datasets[0].data.reduce((sum, v) => sum + v, 0);
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const x = (chartArea.left + chartArea.right) / 2;
      const y = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = labelColor;
      ctx.font = "12px sans-serif";
      ctx.fillText("Total", x, y - 12);
      ctx.fillStyle = valueColor;
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`$${total.toLocaleString()}`, x, y + 10);
      ctx.restore();
    },
  };
}

export default function CategoryPieChart({ data, title = "By Category" }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const textPrimary = isLight ? "#0f172a" : "#f8fafc";
  const textSecondary = isLight ? "#52606d" : "#94a3b8";
  const segmentBorder = isLight ? "#ffffff" : "#1e293b";

  const labels = data.map((d) => d.category);
  const values = data.map((d) => Number(d.total));
  const total = values.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Amount ($)",
        data: values,
        backgroundColor: COLORS,
        borderWidth: 2,
        borderColor: segmentBorder,
        hoverOffset: 12,
        hoverBorderColor: textPrimary,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed;
            const pct = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${ctx.label}: $${value.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <h3>{title}</h3>
      {data.length > 0 ? (
        <>
          <div className="chart-canvas chart-canvas-donut">
            <Doughnut
              data={chartData}
              options={options}
              plugins={[createCenterTotalPlugin(textSecondary, textPrimary)]}
            />
          </div>
          <div className="chart-legend">
            {labels.map((label, i) => {
              const pct = total ? ((values[i] / total) * 100).toFixed(1) : 0;
              return (
                <div className="chart-legend-item" key={label}>
                  <span className="chart-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="chart-legend-label">
                    {CATEGORY_ICONS[label] || "📦"} {label}
                  </span>
                  <span className="chart-legend-value">
                    ${values[i].toLocaleString()} <small>({pct}%)</small>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="empty-state">No data to display yet.</p>
      )}
    </div>
  );
}
