import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "taskTrackerAuth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        userID: null,
        role: null,
        token: null,
        isAuthenticated: false,
      };
    }
    try {
      const parsed = JSON.parse(saved);
      return {
        userId: parsed.userId,
        role: parsed.role,
        token: parsed.token,
        isAuthenticated: true,
      };
    } catch {
      return {
        userID: null,
        role: null,
        token: null,
        isAuthenticated: false,
      };
    }
  });

  useEffect(() => {
    if (!auth.isAuthenticated) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    const { userId, role, token } = auth;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userId, role, token })
    );
  }, [auth]);

  const login = ({ userId, role, token }) => {
    setAuth({ userId, role, token, isAuthenticated: true});
  }

  const logout = () => {
    setAuth({ userId: null, role: null, token: null, isAuthenticated: false });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
