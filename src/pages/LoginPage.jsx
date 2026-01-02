import { useState } from "react";
import { loginRequest } from "../api/auth";
import { decodeJwt } from "../utils/jwt";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try{
            const { token } = await loginRequest({ email, password });
            const payload = decodeJwt(token);
            if (!payload) throw new Error('Invalid Token');
            
            login({
                userId: payload.userId,
                role: payload.role,
                token,
            });

            navigate('/tasks');
        }
        catch(error) {
            setError(error.message);
        }
    };

  return (
    <section>
      <h1>LoginPage</h1>
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
        { error && <p style={{ color: 'red' }}>{error}</p> }
        <button type="submit">Log In</button>
      </form>
    </section>
  );
}