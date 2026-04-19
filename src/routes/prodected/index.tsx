import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedLayout = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <h1>Role Management</h1>
          {user ? (
            <p>
              Signed in as <strong>{user.name}</strong> ({user.role})
            </p>
          ) : (
            <p>Please sign in to continue.</p>
          )}
        </div>

        <nav className="app-nav">
          <Link to="/dashboard">Dashboard</Link>
          {hasPermission("VIEW_PRODUCTS") && <Link to="/products">Products</Link>}
        </nav>

        <div className="app-actions">
          {user ? (
            <button type="button" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
