import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return (
      <div className="page-card">
        <h1>Dashboard</h1>
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <section className="page-card">
      <h1>Dashboard</h1>
      <p>Welcome back, {user.name}.</p>

      <div className="summary-grid">
        <div className="summary-card">
          <h2>Role</h2>
          <strong>{user.role}</strong>
        </div>

        <div className="summary-card">
          <h2>Permissions</h2>
          <ul>
            {user.permissions?.map((permission) => (
              <li key={permission}>{permission}</li>
            )) ?? <li>No permissions assigned.</li>}
          </ul>
        </div>

        <div className="summary-card">
          <h2>Available actions</h2>
          <ul>
            <li>{hasPermission("VIEW_PRODUCTS") ? "View products" : "Products hidden"}</li>
            <li>{hasPermission("EDIT_PRODUCT") ? "Edit products" : "Edit disabled"}</li>
            <li>{hasPermission("DELETE_PRODUCT") ? "Delete products" : "Delete disabled"}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
