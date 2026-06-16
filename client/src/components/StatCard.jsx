export default function StatCard({ label, value, color, hint }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <p style={color ? { color } : undefined}>{value}</p>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}
