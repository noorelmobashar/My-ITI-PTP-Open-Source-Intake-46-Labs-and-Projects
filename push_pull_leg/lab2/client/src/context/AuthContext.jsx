import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

// =============================================
// Auth Context
// Manages user authentication state across the app.
// Provides: user, token, login(), register(), logout()
// Persists the JWT token in localStorage.
// =============================================

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, verify it by fetching the user profile
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (error) {
          // Token is invalid or expired — clear it
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    const { token: newToken, user: newUser } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);

    return newUser;
  };

  // Login an existing user
  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    const { token: newToken, user: newUser } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);

    return newUser;
  };

  // Logout the current user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
