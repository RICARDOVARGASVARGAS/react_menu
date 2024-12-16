const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://secov_back.test/api" // URL en desarrollo
    : "https://api.tu-dominio.com"); // URL en producción

export default API_BASE_URL;
