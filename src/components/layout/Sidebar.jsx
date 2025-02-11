import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaCar,
  FaHistory,
  FaFileAlt,
  FaSignOutAlt,
  FaTimes,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaTrademark,
  FaCubes,
  FaCalendarAlt,
  FaUsers,
  FaPalette,
  FaUserTag,
} from "react-icons/fa";
import { useAuth } from "../../hooks/AuthContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth(); // Obtén la función logout del contexto
  const navigate = useNavigate(); // Usa useNavigate para redirigir después del logout

  const handleLogout = async () => {
    console.log("ingreso a logout");
    try {
      await logout(); // Llama a la función logout
      navigate("/login"); // Redirige al usuario a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-gradient-to-b from-blue-900 to-blue-600 text-white transition-transform lg:translate-x-0 lg:static lg:w-64 max-h-screen overflow-y-auto`}
    >
      {/* Cerrar botón para versión móvil */}
      {isSidebarOpen && (
        <button
          className="lg:hidden absolute top-4 right-4 text-white text-2xl"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center justify-center h-16 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-wide">SECoV</h1>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-4 px-4">
        <img
          src="/images/logo-min.jpg"
          alt="Perfil"
          className="w-20 h-20 rounded-full border-2 border-yellow-400"
        />
        <h2 className="mt-2 text-lg font-semibold">SECOV</h2>
        <p className="text-sm text-yellow-300">Sistema de Control Vehicular</p>
      </div>

      {/* Navigation Options */}
      <nav className="mt-6">
        <ul>
          <li>
            <Link
              to="/list-drivers"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                location.pathname === "/list-drivers"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaUserCircle className="text-lg" />
              <span className="ml-3 text-sm font-medium">Conductores</span>
            </Link>
          </li>
          <li>
            <Link
              to="/list-cars"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                location.pathname === "/list-cars"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaCar className="text-lg" />
              <span className="ml-3 text-sm font-medium">Vehículos</span>
            </Link>
          </li>
          <li>
            <Link
              to="/list-roles"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                location.pathname === "/list-roles"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaUserTag className="text-lg" />
              <span className="ml-3 text-sm font-medium">Roles</span>
            </Link>
          </li>
          <li>
            <Link
              to="/list-users"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                location.pathname === "/list-users"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaUsers className="text-lg" />
              <span className="ml-3 text-sm font-medium">Usuarios</span>
            </Link>
          </li>
          {/* Configuración */}
          <li>
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="flex items-center py-3 px-4 w-full transition hover:bg-blue-700"
            >
              <FaCog className="text-lg" />
              <span className="ml-3 text-sm font-medium">Configuración</span>
              {isConfigOpen ? (
                <FaChevronUp className="ml-auto text-sm" />
              ) : (
                <FaChevronDown className="ml-auto text-sm" />
              )}
            </button>
            {/* Submenú */}
            {isConfigOpen && (
              <ul className="ml-8">
                <li>
                  <Link
                    to="/settings/list-brands"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-2 px-4 text-sm transition ${
                      location.pathname === "/settings/list-brands"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <FaTrademark className="text-lg" />
                    <span className="ml-3">Marcas</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/list-examples"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-2 px-4 text-sm transition ${
                      location.pathname === "/settings/list-examples"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <FaCubes className="text-lg" />
                    <span className="ml-3">Modelos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/list-years"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-2 px-4 text-sm transition ${
                      location.pathname === "/settings/list-years"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <FaCalendarAlt className="text-lg" />
                    <span className="ml-3">Años</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/list-type-cars"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-2 px-4 text-sm transition ${
                      location.pathname === "/settings/list-type-cars"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <FaCar className="text-lg" />
                    <span className="ml-3">Tipos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/list-groups"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-2 px-4 text-sm transition ${
                      location.pathname === "/settings/list-groups"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <FaUsers className="text-lg" />
                    <span className="ml-3">Asociaciones</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/list-colors"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center py-2 px-4 text-sm transition ${
                      location.pathname === "/settings/list-colors"
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <FaPalette className="text-lg" />
                    <span className="ml-3">Colores</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="relative bottom-0 w-full border-t border-blue-700">
        <button
          onClick={handleLogout} // Usa la función handleLogout
          className="flex items-center w-full py-3 px-4 text-left hover:bg-blue-700 transition"
        >
          <FaSignOutAlt className="h-6 w-6 text-yellow-300 group-hover:text-white" />
          <span className="ml-3 text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
