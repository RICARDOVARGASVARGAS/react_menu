import React, { useState } from "react";
import { FaUserCircle, FaCar, FaHistory, FaFileAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Conductores");

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gradient-to-b from-blue-900 to-blue-600 text-white transition-transform lg:translate-x-0 lg:static`}
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <h1 className="text-2xl font-bold tracking-wide">SECOV</h1>
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
              { name: "Conductores", icon: <FaUserCircle /> },
              { name: "Vehículos", icon: <FaCar /> },
              { name: "Historial", icon: <FaHistory /> },
              { name: "Papeletas", icon: <FaFileAlt /> },
            ].map((item, idx) => (
              <li key={idx} className="relative group">
                <a
                  href="#"
                  onClick={() => setActiveItem(item.name)}
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
                </a>
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
            <span className="ml-3 text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <header className="bg-blue-600 text-white flex items-center justify-between h-16 px-4 shadow lg:hidden">
          <div className="flex items-center">
            <button
              aria-label="Abrir menú lateral"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold">SECoV</h1>
          </div>
        </header>

        {/* Overlay for small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4">
          <h2 className="text-2xl font-bold text-blue-900">
            Bienvenido a SECoV
          </h2>
          <p className="mt-2 text-gray-700">
            Selecciona una opción del menú para empezar.
          </p>
        </main>
      </div>
    </div>
  );
};

export default App;
