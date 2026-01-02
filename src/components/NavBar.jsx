import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <header>
      <h1>Task Tracker</h1>
      <nav>
        <Link to="/">Home</Link> |{" "}
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link> |{" "}
          </>
        ) : (
          <>
            <Link to="/tasks">Tasks</Link> |<span>Logged in, ({role})</span>{" "}
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
