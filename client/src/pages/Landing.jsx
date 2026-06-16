import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const FEATURES = [
  {
    icon: "💰",
    title: "Income & Expense Tracking",
    desc: "Log income and expenses with categories and dates, and edit or delete them anytime.",
  },
  {
    icon: "🎯",
    title: "Smart Budgets",
    desc: "Set monthly budgets per category and get instant warnings when you go over.",
  },
  {
    icon: "📊",
    title: "Visual Reports",
    desc: "Pie and bar charts break down where your money comes from and where it goes.",
  },
  {
    icon: "📄",
    title: "PDF & Excel Export",
    desc: "Export your transaction history as a PDF report or Excel spreadsheet in one click.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    desc: "JWT-based login with role-based access keeps your account and data protected.",
  },
  {
    icon: "👨‍💼",
    title: "Admin Dashboard",
    desc: "Admins get a system-wide view: manage users and monitor transactions and analytics.",
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <span className="landing-brand">Wallet.io</span>
        <div className="landing-nav-links">
          <ThemeToggle />
          <Link to="/login" className="btn-ghost">
            Sign In
          </Link>
          <Link to="/register" className="btn-add">
            Get Started
          </Link>
        </div>
      </nav>

      <header className="landing-hero">
        <h1 className="landing-title">Take Control of Your Finances</h1>
        <p className="landing-subtitle">
          Track income and expenses, set smart budgets, and visualize your
          financial health — all in one place.
        </p>
        <div className="landing-cta">
          <Link to="/register" className="btn-add">
            Get Started Free
          </Link>
          <Link to="/login" className="btn-ghost">
            Sign In
          </Link>
        </div>
      </header>

      <section className="landing-features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <p>Wallet.io — Built with PostgreSQL, Express, React & Node.</p>
      </footer>
    </div>
  );
}
