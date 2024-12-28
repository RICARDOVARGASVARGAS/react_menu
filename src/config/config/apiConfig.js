export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://secov_back.test/api" // URL en desarrollo
    : "https://api.tu-dominio.com"); // URL en producción

export const API_STORAGE_URL =
  import.meta.env.VITE_API_STORAGE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://storage_sync.test/api" // URL en desarrollo
    : "https://storage.tu-dominio.com"); // URL en producción

export const TOKEN_API_STORAGE = "064b448c-059a-4c3b-8507-312bfa1219ad"; //"064b448c-059a-4c3b-8507-312bfa1219ad";

export const API_DATA_PEOPLE_URL =
  "https://data-people.codepro-peru.com/api/getPerson"; // URL de la API de personas
