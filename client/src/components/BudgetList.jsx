import { CATEGORY_ICONS } from "../utils/categories";

export default function BudgetList({ budgets, onDelete }) {
  if (budgets.length === 0) {
    return <p className="empty-state">No budgets set for this month yet.</p>;
  }

  return (
    <div className="budget-list">
      {budgets.map((b) => {
        const pct = b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0;
        return (
          <div className="budget-item" key={b.id}>
            <div className="budget-item-header">
              <span>
                {CATEGORY_ICONS[b.category] || "📦"} {b.category}
              </span>
              <span>
                ${Number(b.spent).toLocaleString()} / ${Number(b.amount).toLocaleString()}
              </span>
            </div>
            <div className="budget-bar">
              <div
                className={`budget-bar-fill ${b.exceeded ? "exceeded" : ""}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="budget-item-footer">
              {b.exceeded ? (
                <span className="alert-text">
                  ⚠ Budget exceeded by ${Math.abs(Number(b.remaining)).toLocaleString()}
                </span>
              ) : (
                <span className="muted-text">
                  ${Number(b.remaining).toLocaleString()} remaining
                </span>
              )}
              <button className="delete-btn" onClick={() => onDelete(b.id)}>
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
