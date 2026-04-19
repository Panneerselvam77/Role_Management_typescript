import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div className="page-card">
    <h1>Access denied</h1>
    <p>You do not have permission to open this page.</p>
    <Link to="/dashboard" className="button-link">
      Return to Dashboard
    </Link>
  </div>
);

export default UnauthorizedPage;
