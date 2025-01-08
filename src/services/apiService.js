import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../config/enviroments";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isMultipart = false, // Indica si se envía multipart
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
    headers: isMultipart
      ? {
          Accept: "application/json",
        } // No configuramos `Content-Type` para `FormData`
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
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
export const apiPost = (endpoint, body, isMultipart = false) =>
  apiRequest(endpoint, "POST", body, isMultipart);
export const apiPut = (endpoint, body, params = {}) =>
  apiRequest(endpoint, "PUT", body, params);
export const apiDelete = (endpoint, params = {}) =>
  apiRequest(endpoint, "DELETE", null, params);

// Función API GENERAL
export const apiFetch = async (
  endpoint,
  params = {},
  method = "GET",
  body = null
) => {
  // Crear los parámetros de consulta si existen
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : `${endpoint}`;

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
    throw error;
  }
};

// Subir Archivos - NO SRIVE
export const uploadFileStorage = async (
  file,
  model,
  model_id,
  model_storage,
  storage
) => {
  // Configuración de la solicitud
  const body = new FormData();
  body.append("file", file);
  body.append("model", model);
  body.append("model_id", model_id);
  body.append("model_storage", model_storage);
  body.append("storage", storage);
  body.append("api_key", TOKEN_API_STORAGE);

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body, // Incluimos el cuerpo directamente en las opciones
  };

  try {
    // Realizamos la solicitud
    const response = await fetch(`${API_BASE_URL}/uploadFile`, options);

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
    console.error(error);
    // Relanzamos el error para que sea manejado en la capa superior
    throw error;
  }
};
