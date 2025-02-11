import React, { createContext, useContext, useState, useEffect } from "react";
import { apiPost } from "../services/apiService";
import { toast } from "react-toastify";

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar el estado de autenticación al cargar la página
  useEffect(() => {
    console.log("Verificando autenticación...");
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedExpiresAt = localStorage.getItem("expires_at");

    if (storedUser && storedToken && storedExpiresAt) {
      const expiresAt = parseInt(storedExpiresAt, 10);
      const currentTime = Date.now();

      if (currentTime < expiresAt) {
        // Token aún válido
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Token expirado, limpiar datos
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  // Configurar un temporizador para cerrar sesión automáticamente
  useEffect(() => {
    if (token) {
      const expiresIn = JSON.parse(localStorage.getItem("expires_in")) * 1000; // Convertir a milisegundos
      const timeout = setTimeout(() => {
        logout(); // Cerrar sesión automáticamente
      }, expiresIn);

      return () => clearTimeout(timeout); // Limpiar el temporizador si el componente se desmonta
    }
  }, [token]);

  // Función para iniciar sesión
  const login = async ({ username, password }) => {
    try {
      const response = await apiPost("auth/login", { username, password });
      const { user, token, expires_in } = response;

      // Calcular el tiempo de expiración
      const expiresInMs = expires_in * 1000; // Convertir a milisegundos
      const expiresAt = Date.now() + expiresInMs;

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("expires_at", expiresAt);

      // Actualizar el estado
      setUser(user);
      setToken(token);
    } catch (error) {
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await apiPost("auth/logout"); // Opcional: Si el backend necesita procesar el logout

      // Limpiar el estado y localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("expires_at");

      // Mostrar notificación de cierre de sesión exitoso
      toast.success("Sesión cerrada correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Error al cerrar sesión", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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
