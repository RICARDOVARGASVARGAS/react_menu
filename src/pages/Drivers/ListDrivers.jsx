import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { FaSearch, FaEraser, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import RegisterDriver from "./RegisterDriver";
import EditDriver from "./EditDriver";
import { apiGet } from "../../services/apiService";

const ListDrivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    setIsLoading(true);
    const { data, meta, message } = await apiGet("getDrivers", {
      page: currentPage,
      perPage: itemsPerPage,
      sort: "desc",
      search: searchQuery,
    });
    setDrivers(data);
    setTotalPages(meta.last_page);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const actions = [
    {
      label: <FaEye />,
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (driver) => navigate(`/drivers/${driver.id}/view`),
    },
    {
      label: <FaEdit />,
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (driver) => navigate(`/edit-driver/${driver.id}`),
    },
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <main className="p-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Lista de Conductores
            </h1>
            <button
              onClick={() => navigate("/register-driver")}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
            >
              <FaPlus /> Agregar Conductor
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ...."
              className="border border-gray-300 rounded px-4 py-2 flex-1"
              onKeyPress={handleKeyPress}
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

          {isLoading ? (
            <Loading /> // Muestra el componente Loading durante la carga
          ) : (
            <>
              <Table
                headers={[
                  "N°",
                  "N° Documento",
                  "Nombres Completos",
                  "Teléfono",
                  "Operaciones",
                ]}
                data={drivers.map((driver, index) => ({
                  id: driver.id,
                  document_number: driver.document_number,
                  name: `${driver.name} ${driver.first_name} ${driver.last_name}`,
                  phone: driver.phone_number || "N/A",
                }))}
                actions={actions}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ListDrivers;
