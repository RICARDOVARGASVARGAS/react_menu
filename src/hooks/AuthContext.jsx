import React, { createContext, useContext, useState, useEffect } from "react";
import { apiPost } from "../services/apiService";

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    console.log("user", user);
    console.log("token", token);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiPost("auth/login", credentials);
      const { user, token } = response;

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { message } = await apiPost("auth/logout");
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log(message);
    } catch (error) {
      console.error("Error en el logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
