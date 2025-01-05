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

  try {
    // Realizamos la solicitud
    const response = await fetch(url, options);

    // Verificar si la respuesta no fue exitosa (código >= 400)
    if (!response.ok) {
      const error = await response.json();
      throw {
        status: response.status,
        message: error.message || "Error al realizar la solicitud.",
        errors: error.errors || {},
      };
    }

    // Retornamos el JSON si la respuesta fue exitosa
    return response.json();
  } catch (error) {
    // Relanzamos el error para que sea manejado en la capa superior
    // console.log(error);
    throw error;
  }
};

// Funciones específicas para cada método
export const apiGet = (endpoint, params = {}) =>
  apiRequest(endpoint, "GET", null, params);
export const apiPost = (endpoint, body) => apiRequest(endpoint, "POST", body);
export const apiPut = (endpoint, body, params = {}) =>
  apiRequest(endpoint, "PUT", body, params);
export const apiDelete = (endpoint, params = {}) =>
  apiRequest(endpoint, "DELETE", null, params);
