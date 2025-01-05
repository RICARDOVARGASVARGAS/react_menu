import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import Loading from "../../../components/Loading";
import axios from "axios";
import { FaSearch, FaEraser, FaEdit, FaPlus } from "react-icons/fa";
import RegisterColor from "./RegisterColor";
import EditColor from "./EditColor";
import { apiGet } from "../../../services/apiService";

const ListColors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState("");
  const [selectItemId, setSelectItemId] = useState(null);
  const itemsPerPage = 10;

  // Abrir el modal
  const handleOpenModal = (modal, id = null) => {
    setIsOpenModal(modal);
    setSelectItemId(id);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setIsOpenModal("");
    setSelectItemId(null);
    fetchItems();
  };

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, meta, message } = await apiGet("getColors", {
      page: currentPage,
      perPage: itemsPerPage,
      sort: "desc",
      search: searchQuery,
    });
    setData(data);
    setTotalPages(meta.last_page);
    setIsLoading(false);
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
      onClick: (item) => handleOpenModal("edit", item.id),
    },
  ];

  return (
    <>
      <div className="flex-1 overflow-auto">
        <main className="p-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Lista de Colores
            </h1>
            <button
              onClick={() => handleOpenModal("add")}
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
            <Loading />
          ) : (
            <>
              <Table
                headers={["N°", "Nombre", "Hex", "Operaciones"]}
                data={data.map((item, index) => ({
                  id: item.id,
                  name: item.name,
                  hex: (
                    <span
                      className="block w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.hex }}
                      title={item.hex} // Tooltip con el valor hexadecimal
                    ></span>
                  ),
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
      {isOpenModal === "add" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <RegisterColor onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {isOpenModal === "edit" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <EditColor onClose={handleCloseModal} itemId={selectItemId} />
          </div>
        </div>
      )}
    </>
  );
};

export default ListColors;
