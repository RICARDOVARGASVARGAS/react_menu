import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileToolbar from "../components/MobileToolbar";
import { Link } from "react-router-dom";

const ListDrivers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Juan Pérez", phone: "123456789", email: "juan@mail.com" },
    { id: 2, name: "María López", phone: "987654321", email: "maria@mail.com" },
    {
      id: 3,
      name: "Carlos Ramírez",
      phone: "111222333",
      email: "carlos@mail.com",
    },
    { id: 4, name: "Ana Torres", phone: "555666777", email: "ana@mail.com" },
  ]);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(drivers.length / itemsPerPage);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Drivers"
      />

      <div className="flex-1">
        <MobileToolbar setIsSidebarOpen={setIsSidebarOpen} title="Lista de conductores" />

        {/* Contenido principal */}
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              List of Drivers
            </h1>
            <Link
              to="/drivers/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register Driver
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
              className="border border-gray-300 rounded px-4 py-2 flex-1"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          {/* Tabla de conductores */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{driver.name}</td>
                    <td className="px-4 py-2">{driver.phone}</td>
                    <td className="px-4 py-2">{driver.email}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600">
                          Edit
                        </button>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedDrivers.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No drivers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListDrivers;
