import "./App.css";
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./routes/auth/login";
import UnauthorizedPage from "./routes/auth/unAuthorized";
import ProtectedLayout from "./routes/prodected";
import DashboardPage from "./routes/prodected/dashboard";
import ProductsPage from "./routes/prodected/products";
import { useAuth } from "./context/AuthContext";

const RequireAuth = ({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route
          index
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="products"
          element={
            <RequireAuth permission="VIEW_PRODUCTS">
              <ProductsPage />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
