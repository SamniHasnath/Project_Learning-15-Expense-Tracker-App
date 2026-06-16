import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get("/admin/users", { params: search ? { search } : {} });
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    await api.patch(`/admin/users/${user.id}/status`, { status: newStatus });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user and all their data? This cannot be undone.")) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ color: "var(--text-primary)" }}>Users</h3>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "260px" }}
        />
      </div>

      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge badge-${u.status}`}>{u.status}</span>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="form-actions">
                    <button className="btn-ghost" onClick={() => toggleStatus(u)}>
                      {u.status === "active" ? "Block" : "Unblock"}
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-state">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
