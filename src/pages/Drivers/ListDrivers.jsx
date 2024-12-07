import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import MobileToolbar from "../../components/MobileToolbar";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import axios from "axios";
import { FaSearch, FaEraser } from "react-icons/fa";
import { FaEye, FaEdit } from "react-icons/fa";

const ListDrivers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `http://secov_back.test/api/getDrivers`,
        {
          params: {
            page: currentPage,
            perPage: itemsPerPage,
            sort: "desc",
            search: searchTerm,
          },
        }
      );
      const { data, meta } = response.data;
      setDrivers(data);
      setTotalPages(meta.last_page);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [currentPage, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1); // Reinicia la paginación
  };

  const handleClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Define acciones para los botones
  const actions = [
    {
      label: <FaEye />,
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (driver) => navigate(`/drivers/${driver.id}/view`),
    },
    {
      label: <FaEdit />,
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (driver) => navigate(`/drivers/${driver.id}/edit`),
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Drivers"
      />

      <div className="flex-1">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Lista de conductores"
        />

        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Lista de Conductores
            </h1>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ...."
              className="border border-gray-300 rounded px-4 py-2 flex-1"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <FaSearch />
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              <FaEraser />
            </button>
          </div>

          {/* Usa el componente Table */}
          <Table
            headers={["N°", "N° Documento", "Nombres Completos", "Teléfono", "Operaciones"]}
            data={drivers.map((driver) => ({
              id: driver.id,
              document_number: driver.document_number,
              name: `${driver.name} ${driver.first_name} ${driver.last_name}`,
              phone: driver.phone_number || "No disponible",
            }))}
            actions={actions}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default ListDrivers;
