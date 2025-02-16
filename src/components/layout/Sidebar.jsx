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
import ProtectedComponent from "../../components/ProtectedComponent";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 max-h-screen overflow-y-auto shadow-2xl`}
    >
      {/* Botón para cerrar en móviles */}
      {isSidebarOpen && (
        <button
          className="lg:hidden absolute top-4 right-4 text-white text-2xl hover:text-yellow-300 transition-colors duration-200"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      )}

      {/* Header del Sidebar */}
      <div className="flex items-center justify-center h-20 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-wide text-yellow-300">
          SECOV
        </h1>
      </div>

      {/* Sección de Perfil */}
      <div className="flex flex-col items-center mt-6 px-4">
        <img
          src="/images/logo-min.jpg"
          alt="Perfil"
          className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg"
        />
        <h2 className="mt-4 text-xl font-semibold">
          {`${user.name} ${user.first_name} ${user.last_name}`.slice(0, 17)}...
        </h2>
        <p className="text-sm text-yellow-300 text-center">
          Sistema de Control Vehicular
        </p>
      </div>

      {/* Navegación */}
      <nav className="mt-8">
        <ul>
          {/* Conductores */}
          <ProtectedComponent requiredPermissions={"driver.index"}>
            <li>
              <Link
                to="/list-drivers"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center py-3 px-6 transition-all duration-200 ${
                  location.pathname === "/list-drivers"
                    ? "bg-blue-700 text-white shadow-lg"
                    : "hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                <FaUserCircle className="text-lg" />
                <span className="ml-3 text-sm font-medium">Conductores</span>
              </Link>
            </li>
          </ProtectedComponent>

          {/* Vehículos */}
          <ProtectedComponent requiredPermissions={"car.index"}>
            <li>
              <Link
                to="/list-cars"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center py-3 px-6 transition-all duration-200 ${
                  location.pathname === "/list-cars"
                    ? "bg-blue-700 text-white shadow-lg"
                    : "hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                <FaCar className="text-lg" />
                <span className="ml-3 text-sm font-medium">Vehículos</span>
              </Link>
            </li>
          </ProtectedComponent>

          {/* Roles */}
          <ProtectedComponent requiredPermissions={"role.index"}>
            <li>
              <Link
                to="/list-roles"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center py-3 px-6 transition-all duration-200 ${
                  location.pathname === "/list-roles"
                    ? "bg-blue-700 text-white shadow-lg"
                    : "hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                <FaUserTag className="text-lg" />
                <span className="ml-3 text-sm font-medium">Roles</span>
              </Link>
            </li>
          </ProtectedComponent>

          {/* Usuarios */}
          <ProtectedComponent requiredPermissions={"user.index"}>
            <li>
              <Link
                to="/list-users"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center py-3 px-6 transition-all duration-200 ${
                  location.pathname === "/list-users"
                    ? "bg-blue-700 text-white shadow-lg"
                    : "hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                <FaUsers className="text-lg" />
                <span className="ml-3 text-sm font-medium">Usuarios</span>
              </Link>
            </li>
          </ProtectedComponent>

          {/* Configuración */}
          <ProtectedComponent
            requiredPermissions={[
              "brand.index",
              "example.index",
              "year.index",
              "type.index",
              "color.index",
              "group.index",
            ]}
          >
            <li>
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="flex items-center py-3 px-6 w-full transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
              >
                <FaCog className="text-lg" />
                <span className="ml-3 text-sm font-medium">Configuración</span>
                {isConfigOpen ? (
                  <FaChevronUp className="ml-auto text-sm" />
                ) : (
                  <FaChevronDown className="ml-auto text-sm" />
                )}
              </button>
              {/* Submenú de Configuración */}
              {isConfigOpen && (
                <ul className="ml-8">
                  <ProtectedComponent requiredPermissions={"brand.index"}>
                    <li>
                      <Link
                        to="/settings/list-brands"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center py-2 px-4 text-sm transition-all duration-200 ${
                          location.pathname === "/settings/list-brands"
                            ? "bg-blue-700 text-white shadow-lg"
                            : "hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        <FaTrademark className="text-lg" />
                        <span className="ml-3">Marcas</span>
                      </Link>
                    </li>
                  </ProtectedComponent>
                  <ProtectedComponent requiredPermissions={"example.index"}>
                    <li>
                      <Link
                        to="/settings/list-examples"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center py-2 px-4 text-sm transition-all duration-200 ${
                          location.pathname === "/settings/list-examples"
                            ? "bg-blue-700 text-white shadow-lg"
                            : "hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        <FaCubes className="text-lg" />
                        <span className="ml-3">Modelos</span>
                      </Link>
                    </li>
                  </ProtectedComponent>
                  <ProtectedComponent requiredPermissions={"year.index"}>
                    <li>
                      <Link
                        to="/settings/list-years"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center py-2 px-4 text-sm transition-all duration-200 ${
                          location.pathname === "/settings/list-years"
                            ? "bg-blue-700 text-white shadow-lg"
                            : "hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        <FaCalendarAlt className="text-lg" />
                        <span className="ml-3">Años</span>
                      </Link>
                    </li>
                  </ProtectedComponent>
                  <ProtectedComponent requiredPermissions={"type.index"}>
                    <li>
                      <Link
                        to="/settings/list-type-cars"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center py-2 px-4 text-sm transition-all duration-200 ${
                          location.pathname === "/settings/list-type-cars"
                            ? "bg-blue-700 text-white shadow-lg"
                            : "hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        <FaCar className="text-lg" />
                        <span className="ml-3">Tipos</span>
                      </Link>
                    </li>
                  </ProtectedComponent>
                  <ProtectedComponent requiredPermissions={"group.index"}>
                    <li>
                      <Link
                        to="/settings/list-groups"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center py-2 px-4 text-sm transition-all duration-200 ${
                          location.pathname === "/settings/list-groups"
                            ? "bg-blue-700 text-white shadow-lg"
                            : "hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        <FaUsers className="text-lg" />
                        <span className="ml-3">Asociaciones</span>
                      </Link>
                    </li>
                  </ProtectedComponent>
                  <ProtectedComponent requiredPermissions={"color.index"}>
                    <li>
                      <Link
                        to="/settings/list-colors"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center py-2 px-4 text-sm transition-all duration-200 ${
                          location.pathname === "/settings/list-colors"
                            ? "bg-blue-700 text-white shadow-lg"
                            : "hover:bg-blue-700 hover:shadow-lg"
                        }`}
                      >
                        <FaPalette className="text-lg" />
                        <span className="ml-3">Colores</span>
                      </Link>
                    </li>
                  </ProtectedComponent>
                </ul>
              )}
            </li>
          </ProtectedComponent>
        </ul>
      </nav>

      {/* Botón de Cerrar Sesión */}
      <div className="absolute bottom-0 w-full border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-4 px-6 text-left hover:bg-blue-700 transition-all duration-200"
        >
          <FaSignOutAlt className="h-6 w-6 text-yellow-300" />
          <span className="ml-3 text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
