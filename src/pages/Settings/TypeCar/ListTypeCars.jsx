import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import MobileToolbar from "../../../components/MobileToolbar";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import Loading from "../../../components/Loading"; // Importa el componente Loading
import axios from "axios";
import { FaSearch, FaEraser, FaEdit, FaPlus } from "react-icons/fa";
import API_BASE_URL from "../../../config/config/apiConfig";
import RegisterTypeCar from "./RegisterTypeCar";
import EditTypeCar from "./EditTypeCar";

const ListTypeCars = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [addForm, setAddForm] = useState(false); // Estado para el modal de agregar
  const [editForm, setEditForm] = useState(false); // Estado para el modal de editar
  const [selectItemId, setSelectItemId] = useState(null); // ID del item seleccionado para editar

  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Abrir el modal de agregar
  const handleAddForm = () => {
    setAddForm(true);
  };

  // Cerrar el modal de agregar
  const closeAddForm = () => {
    setAddForm(false);
    fetchItems(); // Recargar la lista de tras agregar uno nuevo
  };

  // Abrir el modal de edición
  const handleEditForm = (itemId) => {
    setSelectItemId(itemId);
    setEditForm(true);
  };

  // Cerrar el modal de edición de
  const closeEditForm = () => {
    setSelectItemId(null);
    setEditForm(false);
    fetchItems();
  };

  const fetchItems = async () => {
    setIsLoading(true); // Activa el estado de carga
    try {
      const response = await axios.get(`${API_BASE_URL}/getTypeCars`, {
        params: {
          page: currentPage,
          perPage: itemsPerPage,
          sort: "desc",
          search: searchQuery,
        },
      });

      const { data, meta } = response.data;
      setData(data);
      setTotalPages(meta.last_page);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  useEffect(() => {
    fetchItems();
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
      label: <FaEdit />,
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (item) => handleEditForm(item.id),
    },
  ];

  return (
    <div className="flex max-h-screen md:min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Detail Driver"
      />

      <div className="flex-1 overflow-auto">
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Lista de Tipos de Vehículos"
        />

        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Lista de Tipos de Vehículos
            </h1>
            <button
              onClick={handleAddForm}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
            >
              <FaPlus /> Agregar
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
                headers={["N°", "Nombre", "Operaciones"]}
                data={data.map((item, index) => ({
                  id: item.id,
                  name: item.name,
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
      {/* Modal de Agregar */}
      {addForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <RegisterTypeCar onClose={closeAddForm} />
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {editForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <EditTypeCar onClose={closeEditForm} itemId={selectItemId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTypeCars;
