import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../api";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const authenticatedUser = await loginRequest(name.trim(), password);
    setIsSubmitting(false);

    if (!authenticatedUser) {
      setError(
        "Invalid credentials. Use one of the users defined in the json-server database.",
      );
      return;
    }

    login(authenticatedUser);
    navigate("/dashboard");
  };

  return (
    <div className="page-card">
      <h1>Sign In</h1>
      <p>
        Enter your name and password to access the role management dashboard.
      </p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alice Johnson"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password123"
            required
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="form-note">
        <strong>Example credentials:</strong>
        <ul>
          <li>Alice Johnson / password123</li>
          <li>Brian Lee / password456</li>
          <li>Carmen Patel / password789</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
