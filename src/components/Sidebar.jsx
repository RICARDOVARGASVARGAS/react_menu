import React from "react";
import { FaUserCircle, FaCar, FaHistory, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, activeItem, setActiveItem }) => {
  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-gradient-to-b from-blue-900 to-blue-600 text-white transition-transform lg:translate-x-0 lg:static`}
    >
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
          {[
            { name: "Drivers", icon: <FaUserCircle />, path: "/drivers" },
            { name: "Vehicles", icon: <FaCar />, path: "/vehicles" },
            { name: "History", icon: <FaHistory />, path: "/history" },
            { name: "Tickets", icon: <FaFileAlt />, path: "/tickets" },
          ].map((item, idx) => (
            <li key={idx} className="relative group">
              <Link
                to={item.path}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsSidebarOpen(false); // Close sidebar on mobile
                }}
                className={`flex items-center py-3 px-4 transition group ${
                  activeItem === item.name
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700"
                }`}
              >
                <span
                  className={`text-lg ${
                    activeItem === item.name
                      ? "text-white"
                      : "text-yellow-300 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
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
