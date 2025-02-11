// pages/NoPermissionsPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const NoPermissionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center text-white">
      {/* Contenedor principal */}
      <div className="w-full max-w-md p-8 bg-blue-800 bg-opacity-80 rounded-lg shadow-2xl space-y-6 text-center">
        {/* Icono grande */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-yellow-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold tracking-wide">Acceso Denegado</h1>

        {/* Mensaje */}
        <p className="text-sm text-gray-300">
          Lo sentimos, no tienes permisos para acceder a este módulo.
        </p>

        {/* Botón de acción */}
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-md shadow-md hover:bg-yellow-500 transition duration-300"
        >
          Ir a Inicio
        </Link>
      </div>
    </div>
  );
};

export default NoPermissionsPage;
