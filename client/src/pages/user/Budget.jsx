import { useEffect, useState } from "react";
import api from "../../api/axios";
import BudgetForm from "../../components/BudgetForm";
import BudgetList from "../../components/BudgetList";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Budget() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const res = await api.get("/budgets", { params: { month, year } });
    setBudgets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleDelete = async (id) => {
    await api.delete(`/budgets/${id}`);
    refresh();
  };

  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="main-grid">
      <div className="card">
        <h3 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>Set Category Budget</h3>
        <BudgetForm month={month} year={year} onSaved={refresh} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 style={{ color: "var(--text-primary)" }}>
            {MONTH_NAMES[month - 1]} {year}
          </h3>
          <div className="month-nav">
            <button className="btn-ghost" onClick={() => changeMonth(-1)}>‹ Prev</button>
            <button className="btn-ghost" onClick={() => changeMonth(1)}>Next ›</button>
          </div>
        </div>
        {loading ? (
          <div className="page-loading">Loading...</div>
        ) : (
          <BudgetList budgets={budgets} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
