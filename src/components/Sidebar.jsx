import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCar, FaHistory, FaFileAlt, FaSignOutAlt, FaTimes } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, activeItem }) => {
  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-gradient-to-b from-blue-900 to-blue-600 text-white transition-transform lg:translate-x-0 lg:static lg:w-64`}
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
          src="https://img.freepik.com/vector-gratis/gradiente-azul-usuario_78370-4692.jpg"
          alt="Perfil"
          className="w-20 h-20 rounded-full border-2 border-yellow-400"
        />
        <h2 className="mt-2 text-lg font-semibold">Juan Pérez</h2>
        <p className="text-sm text-yellow-300">juan.perez@email.com</p>
      </div>

      {/* Navigation Options */}
      <nav className="mt-6">
        <ul>
          <li>
            <Link
              to="/drivers"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                activeItem === "Drivers" ? "bg-blue-700 text-white" : "hover:bg-blue-700"
              }`}
            >
              <FaUserCircle className="text-lg" />
              <span className="ml-3 text-sm font-medium">Drivers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/vehicles"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                activeItem === "Vehicles" ? "bg-blue-700 text-white" : "hover:bg-blue-700"
              }`}
            >
              <FaCar className="text-lg" />
              <span className="ml-3 text-sm font-medium">Vehicles</span>
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                activeItem === "History" ? "bg-blue-700 text-white" : "hover:bg-blue-700"
              }`}
            >
              <FaHistory className="text-lg" />
              <span className="ml-3 text-sm font-medium">History</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tickets"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center py-3 px-4 transition ${
                activeItem === "Tickets" ? "bg-blue-700 text-white" : "hover:bg-blue-700"
              }`}
            >
              <FaFileAlt className="text-lg" />
              <span className="ml-3 text-sm font-medium">Tickets</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full border-t border-blue-700">
        <button
          onClick={() => alert("Cerrar sesión")}
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
