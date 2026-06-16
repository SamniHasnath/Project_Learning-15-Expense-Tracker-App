import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const USER_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/income", label: "Income", icon: "💰" },
  { to: "/expenses", label: "Expenses", icon: "💸" },
  { to: "/budget", label: "Budget", icon: "🎯" },
  { to: "/reports", label: "Reports", icon: "📊" },
];

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview", icon: "🛠️" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/transactions", label: "Transactions", icon: "📑" },
  { to: "/admin/analytics", label: "Analytics", icon: "📈" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-full">Wallet.io</span>
        <span className="sidebar-brand-short">W</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
