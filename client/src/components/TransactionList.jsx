import { CATEGORY_ICONS } from "../utils/categories";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return <p className="empty-state">No transactions yet.</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((tx) => (
        <div className="expense-item" key={tx.id}>
          <div className="expense-item-info">
            <span className="expense-item-icon">{CATEGORY_ICONS[tx.category] || "📦"}</span>
            <div>
              <p className="expense-item-title">{tx.title}</p>
              <span className="expense-item-meta">
                {tx.category} · {new Date(tx.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="expense-item-actions">
            <span className={`amount ${tx.type === "income" ? "amount-income" : "amount-expense"}`}>
              {tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString()}
            </span>
            {onEdit && (
              <button className="icon-btn" onClick={() => onEdit(tx)} title="Edit">
                ✏️
              </button>
            )}
            {onDelete && (
              <button className="delete-btn" onClick={() => onDelete(tx.id)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
