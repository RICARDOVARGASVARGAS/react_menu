import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import MobileToolbar from "../../components/MobileToolbar";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import axios from "axios";
import { FaSearch, FaEraser, FaEye, FaEdit } from "react-icons/fa";

const ListDrivers = () => {
  // Estado para el sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estado para los parámetros de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState(""); // Texto introducido por el usuario
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [searchQuery, setSearchQuery] = useState(""); // Término final que se enviará al backend

  // Estado para almacenar los datos de los conductores
  const [drivers, setDrivers] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas para la paginación

  // Constantes
  const itemsPerPage = 10; // Número de elementos por página
  const navigate = useNavigate(); // Hook para redirigir a otras rutas

  // Función para obtener la lista de conductores desde la API
  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`http://secov_back.test/api/getDrivers`, {
        params: {
          page: currentPage,
          perPage: itemsPerPage,
          sort: "desc", // Orden descendente
          search: searchQuery, // Solo busca cuando el término se haya confirmado con el botón
        },
      });

      const { data, meta } = response.data;
      setDrivers(data); // Establece los datos recibidos en el estado
      setTotalPages(meta.last_page); // Actualiza el total de páginas para la paginación
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Llama a `fetchDrivers` cada vez que cambien `currentPage` o `searchQuery`
  useEffect(() => {
    fetchDrivers();
  }, [currentPage, searchQuery]);

  // Función que maneja el clic del botón Buscar
  const handleSearch = () => {
    setSearchQuery(searchTerm); // Actualiza el término de búsqueda confirmado
    setCurrentPage(1); // Reinicia la paginación a la primera página
  };

  // Función que limpia el término de búsqueda
  const handleClear = () => {
    setSearchTerm(""); // Limpia el input de búsqueda
    setSearchQuery(""); // Reinicia el término confirmado
    setCurrentPage(1); // Reinicia la paginación
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Actualiza la página actual si está dentro de los límites
    }
  };

  // Función para manejar el evento de presionar la tecla "Enter" en el campo de búsqueda
  const handleKeyPress = (e) => {
    if (e.key === "Enter") { // Si la tecla presionada es "Enter"
      handleSearch(); // Ejecuta la búsqueda
    }
  };

  // Define las acciones para la columna de operaciones
  const actions = [
    {
      label: <FaEye />, // Ícono de Visualizar
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (driver) => navigate(`/drivers/${driver.id}/view`), // Navega a la página de visualización
    },
    {
      label: <FaEdit />, // Ícono de Editar
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (driver) => navigate(`/drivers/${driver.id}/edit`), // Navega a la página de edición
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Barra lateral */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeItem="Drivers"
      />

      <div className="flex-1">
        {/* Barra de herramientas móvil */}
        <MobileToolbar
          setIsSidebarOpen={setIsSidebarOpen}
          title="Lista de conductores"
        />

        <main className="p-4">
          {/* Título */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Lista de Conductores
            </h1>
          </div>

          {/* Campo de búsqueda y botones */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Solo actualiza el input
              placeholder="Buscar ...."
              className="border border-gray-300 rounded px-4 py-2 flex-1"
              onKeyPress={handleKeyPress} // Detecta cuando se presiona Enter en el campo de búsqueda
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

          {/* Tabla */}
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

          {/* Paginación */}
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
