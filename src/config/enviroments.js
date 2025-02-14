export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://secov_back.test/api" // URL en desarrollo
    : "https://secov-back.sys-code.com/api"); // URL en producción

export const API_DATA_PEOPLE_URL =
  "https://data-people.sys-code.com/api/getPerson"; // URL de la API de personas
