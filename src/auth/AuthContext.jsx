import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Attach token to Axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Validate token on app load
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const res = await axios.get("/auth/me");
          setUser(res.data); // optional: store user profile
        } catch (err) {
          logout(); // token is invalid or expired
        }
      }
    };
    validateToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const accessToken = res.data.access_token;
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
    } catch (err) {
      const message =
        err.response?.data?.detail || "Login failed. Please check your credentials.";
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
