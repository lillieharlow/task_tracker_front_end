import { useState } from "react";
import { loginRequest, signupRequest } from "../api/auth";
import { decodeJwt } from "../utils/jwt";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await signupRequest({ email, password, role });
      // Option: Navigate back to Login Page
      // navigate('/login')

      // auto-login using the same credentials
      const { token } = await loginRequest({ email, password });
      const payload = decodeJwt(token);

      if (!payload) throw new Error("Invalid Token");

      login({
        userId: payload.userId,
        role: payload.role,
        token,
      });

      navigate("/tasks");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          Role
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
}