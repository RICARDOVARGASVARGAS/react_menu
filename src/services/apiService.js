import { API_BASE_URL } from "../config/enviroments";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  params = {}
) => {
  // Crear los parámetros de consulta si existen
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${API_BASE_URL}/${endpoint}?${queryString}`
    : `${API_BASE_URL}/${endpoint}`;

  // Configuración de la solicitud
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Si hay un cuerpo de solicitud, lo agregamos al objeto de opciones
  if (body) options.body = JSON.stringify(body);

  // Realizamos la solicitud
  const response = await fetch(url, options);

  // Manejo de errores
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al realizar la solicitud.");
  }

  // Retornamos la respuesta
  return response.json();
};

// Funciones específicas para cada método
// Función GET con parámetros
export const apiGet = (endpoint, params = {}) =>
  apiRequest(endpoint, "GET", null, params);

// Función POST (no necesita parámetros en la URL)
export const apiPost = (endpoint, body) => apiRequest(endpoint, "POST", body);

// Función PUT (puede incluir parámetros si es necesario)
export const apiPut = (endpoint, body, params = {}) =>
  apiRequest(endpoint, "PUT", body, params);

// Función DELETE (con soporte para parámetros en la URL si es necesario)
export const apiDelete = (endpoint, params = {}) =>
  apiRequest(endpoint, "DELETE", null, params);
