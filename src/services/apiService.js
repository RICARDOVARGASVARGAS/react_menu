import { API_BASE_URL } from "../config/enviroments";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  // Configuración de Axios
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
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

  // Manejo de errores
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al realizar la solicitud.");
  }

  // Retornamos la respuesta
  return response.json();
};

// Funciones específicas para cada método
export const apiGet = (endpoint) => apiRequest(endpoint, "GET");
export const apiPost = (endpoint, body) => apiRequest(endpoint, "POST", body);
export const apiPut = (endpoint, body) => apiRequest(endpoint, "PUT", body);
export const apiDelete = (endpoint) => apiRequest(endpoint, "DELETE");

// import axios from "axios";
// import { API_BASE_URL } from "../config/config/apiConfig"; // URL base de la API

// // Configuración de Axios
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Función genérica para manejar las respuestas
// const handleResponse = (response) => {
//   if (response.status !== 200) {
//     throw new Error(`Error: ${response.message}`);
//   }
//   return response.data;
// };

// // Función genérica para obtener datos (GET) con parámetros opcionales
// export const get = async (url, params = {}) => {
//   try {
//     // Realizamos la solicitud GET, pasando los parámetros como 'params'
//     const response = await axiosInstance.get(url, { params });
//     return handleResponse(response);
//   } catch (error) {
//     // Manejo de errores
//     console.log("Error en la solicitud GET:", error);
//     throw new Error(
//       error.response ? error.response.data.message : error.message
//     );
//   }
// };

// // Función genérica para enviar datos (POST)
// export const post = async (url, data) => {
//   try {
//     const response = await axiosInstance.post(url, data);
//     return handleResponse(response);
//   } catch (error) {
//     throw new Error(
//       error.response ? error.response.data.message : error.message
//     );
//   }
// };

// // Función para actualizar datos (PUT)
// export const put = async (url, data) => {
//   try {
//     const response = await axiosInstance.put(url, data);
//     return handleResponse(response);
//   } catch (error) {
//     throw new Error(
//       error.response ? error.response.data.message : error.message
//     );
//   }
// };

// // Función para eliminar datos (DELETE)
// export const del = async (url) => {
//   try {
//     const response = await axiosInstance.delete(url);
//     return handleResponse(response);
//   } catch (error) {
//     throw new Error(
//       error.response ? error.response.data.message : error.message
//     );
//   }
// };
