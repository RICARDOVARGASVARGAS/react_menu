export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://secov_back.test/api" // URL en desarrollo
    : "https://secov-back.sys-code.com/api"); // URL en producción

export const TOKEN_API_STORAGE =
  import.meta.env.VITE_TOKEN_API_STORAGE ||
  (import.meta.env.MODE === "development"
    ? "123456789" // URL en desarrollo
    : "9268b146-b9ba-49a4-a8ed-4443697f2c95"); // URL en producción

export const API_DATA_PEOPLE_URL =
  "https://data-people.sys-code.com/api/getPerson"; // URL de la API de personas
