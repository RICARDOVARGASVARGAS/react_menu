import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import MobileToolbar from "../../components/MobileToolbar";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import axios from "axios";
import { FaSearch, FaEraser, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import API_BASE_URL from "../../config/config/apiConfig";

const ListCars = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getCars?included=brand,typeCar,group,year,color,example`,
        {
          params: {
            page: currentPage,
            perPage: itemsPerPage,
            sort: "desc",
            search: searchQuery,
          },
        }
      );

      const { data, meta } = response.data;
      console.log(data, meta);
      setCars(data);
      setTotalPages(meta.last_page);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
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
      onClick: (car) => navigate(`/cars/${car.id}/view`),
    },
    // {
    //     label: <FaEdit />,
    //     className: "bg-blue-500 text-white hover:bg-blue-600",
    //     onClick: (car) => navigate(`/edit-car/${car.id}`),
    // },
  ];

  return (
    <div className="flex max-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Examples"
      />

      <div className="flex-1 overflow-y-auto">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Lista de Autos"
        />

        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">Lista de Autos</h1>
            {/* <button
                            onClick={() => navigate("/register-car")}
                            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
                        >
                            <FaPlus /> Agregar Auto
                        </button> */}
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
            <Loading />
          ) : (
            <>
              <Table
                headers={[
                  "N°",
                  "Placa",
                  "Marca",
                  "Modelo",
                  "Año",
                  "Color",
                  "Asociación",
                  "Operaciones",
                ]}
                data={cars.map((car, index) => ({
                  id: car.id,
                  plate: car.plate,
                  brand: car.brand.name,
                  example: car.example.name,
                  year: car.year.name,
                  color: car.color.name,
                  group: car.group.name,
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
    </div>
  );
};

export default ListCars;
