export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://secov_back.test/api" // URL en desarrollo
    : "https://secov-back.sys-code.com/api"); // URL en producción

export const TOKEN_API_STORAGE =
  import.meta.env.VITE_TOKEN_API_STORAGE ||
  (import.meta.env.MODE === "development"
    ? "123456789" // URL en desarrollo
    : "7f430e18-5c39-420e-ab04-a264fa96ca7d"); // URL en producción

export const API_DATA_PEOPLE_URL =
  "https://data-people.codepro-peru.com/api/getPerson"; // URL de la API de personas
