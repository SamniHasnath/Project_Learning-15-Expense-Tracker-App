import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/user/Dashboard";
import Income from "./pages/user/Income";
import Expenses from "./pages/user/Expenses";
import Budget from "./pages/user/Budget";
import Reports from "./pages/user/Reports";

import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import "./App.css";

function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user) return <Landing />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute role="user" />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
