import React, { useState } from "react";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-blue-900 text-white transition-transform lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <h1 className="text-2xl font-bold">SECoV</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <a
                href="#"
                className="block py-3 px-4 hover:bg-blue-700 transition"
              >
                Conductores
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-3 px-4 hover:bg-blue-700 transition"
              >
                Vehículos
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-3 px-4 hover:bg-blue-700 transition"
              >
                Historial
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-3 px-4 hover:bg-blue-700 transition"
              >
                Papeletas
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <header className="bg-blue-700 text-white flex items-center h-16 px-4 shadow lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-bold">SECoV</h1>
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
