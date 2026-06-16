import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/income": "Income",
  "/expenses": "Expenses",
  "/budget": "Budget",
  "/reports": "Reports",
  "/admin": "Admin Overview",
  "/admin/users": "User Management",
  "/admin/transactions": "All Transactions",
  "/admin/analytics": "Analytics",
};

export default function AppLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || "Wallet.io";

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Topbar title={title} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
