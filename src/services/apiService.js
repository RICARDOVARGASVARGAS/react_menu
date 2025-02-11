import { API_BASE_URL } from "../config/enviroments";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isMultipart = false, // Indica si se envía multipart
  params = {}
) => {
  // Obtener el token del localStorage o del contexto de autenticación
  const token = localStorage.getItem("token"); // O usa el contexto de autenticación si lo tienes

  // Crear los parámetros de consulta si existen
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${API_BASE_URL}/${endpoint}?${queryString}`
    : `${API_BASE_URL}/${endpoint}`;

  // Configuración de la solicitud
  const options = {
    method,
    headers: {
      ...(isMultipart
        ? { Accept: "application/json" } // No configuramos `Content-Type` para `FormData`
        : { "Content-Type": "application/json", Accept: "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }), // Añadir el token si existe
    },
  };

  // Si hay un cuerpo de solicitud, lo agregamos al objeto de opciones
  if (body) {
    options.body = isMultipart ? body : JSON.stringify(body);
  }

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
        success: error.success || false,
      };
    }

    // Retornamos el JSON si la respuesta fue exitosa
    return response.json();
  } catch (error) {
    // Relanzamos el error para que sea manejado en la capa superior
    throw error;
  }
};

// Funciones específicas para cada método
export const apiGet = (endpoint, params = {}) =>
  apiRequest(endpoint, "GET", null, false, params);
export const apiPost = (endpoint, body, isMultipart = false) =>
  apiRequest(endpoint, "POST", body, isMultipart);
export const apiPut = (endpoint, body, params = {}, isMultipart = false) =>
  apiRequest(endpoint, "PUT", body, isMultipart, params);
export const apiDelete = (endpoint, params = {}) =>
  apiRequest(endpoint, "DELETE", null, false, params);

// Función API GENERAL
export const apiFetch = async (
  endpoint,
  params = {},
  method = "GET",
  body = null
) => {
  // Obtener el token del localStorage o del contexto de autenticación
  const token = localStorage.getItem("token"); // O usa el contexto de autenticación si lo tienes

  // Crear los parámetros de consulta si existen
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : `${endpoint}`;

  // Configuración de la solicitud
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Añadir el token si existe
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
        message:
          error.error || error.message || "Error al realizar la solicitud.",
        errors: error.errors || {},
      };
    }

    // Retornamos el JSON si la respuesta fue exitosa
    return response.json();
  } catch (error) {
    // Relanzamos el error para que sea manejado en la capa superior
    throw error;
  }
};
