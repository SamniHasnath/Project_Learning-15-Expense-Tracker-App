import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <h2 className="topbar-title">{title}</h2>
      <div className="topbar-user">
        <ThemeToggle />
        <div className="topbar-user-info">
          <span className="topbar-name">{user?.name}</span>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </div>
        <button className="btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
