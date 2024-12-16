import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import { FaPlus, FaEdit, FaFilePdf, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddCar from "./AddCar"; // Formulario para agregar vehículos
import EditCar from "./EditCar"; // Formulario para editar vehículos
import API_BASE_URL from "../../config/config/apiConfig";

const CarData = ({ driverId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(""); // 'edit' o 'image' o 'pdf'
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false); // Estado para el modal de agregar vehículo
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const navigate = useNavigate(); // Para navegación entre páginas

  // Obtener la lista de vehículos
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/getCarsByDriver/${driverId}`
      );
      const result = await response.json();

      if (result.data) {
        setVehicles(result.data);
      } else {
        setVehicles([]);
        toast.info("El conductor no tiene vehículos registrados.");
      }
    } catch (error) {
      toast.error("Error al cargar los vehículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [driverId]);

  // Abrir el modal de agregar vehículo
  const handleAddVehicle = () => {
    setIsAddVehicleModalOpen(true);
  };

  // Cerrar el modal de agregar vehículo
  const closeAddVehicleModal = () => {
    setIsAddVehicleModalOpen(false);
    fetchVehicles(); // Recargar la lista de vehículos tras agregar uno nuevo
  };

  // Abrir el modal de edición de vehículo
  const handleEditVehicle = (carId) => {
    setSelectedCarId(carId);
    setIsEditVehicleModalOpen(true);
  };

  // Cerrar el modal de edición de vehículo
  const closeEditVehicleModal = () => {
    setSelectedCarId(null);
    setIsEditVehicleModalOpen(false);
    fetchVehicles(); // Recargar la lista de vehículo tras editar uno
  };

  // Obtener el tipo de archivo basado en la extensión
  const getFileType = (url) => {
    if (url) {
      const ext = url.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
      if (ext === "pdf") return "pdf";
      return "other"; // Para otros tipos de archivo, como Excel o Word
    }
    return null;
  };

  // Abrir modal para visualizar archivo
  const handleOpenModal = (url) => {
    const type = getFileType(url);
    setModalData(url);
    setModalType(type);
  };

  // Cerrar el modal de archivos
  const closeModal = () => {
    setModalData(null);
    setModalType("");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Vehículos del Conductor
          </h2>
          <button
            onClick={handleAddVehicle}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaPlus /> Agregar Vehículo
          </button>
        </div>
        {/* Tabla de vehículos */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Placa</th>
                <th className="border px-2 py-1">Motor</th>
                <th className="border px-2 py-1">Características</th>
                <th className="border px-2 py-1">Tipo</th>
                <th className="border px-2 py-1">Grupo</th>
                <th className="border px-2 py-1">SOAT</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="border px-2 py-1 text-center">
                    {vehicle.plate}
                  </td>
                  <td className="border px-2 py-1">
                    <div className="flex flex-col">
                      <span>
                        <strong>Motor:</strong> {vehicle.motor}
                      </span>
                      <span>
                        <strong>Chasis:</strong> {vehicle.chassis}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1">
                    <div className="flex flex-col">
                      <span>
                        <strong>Marca:</strong> {vehicle.brand?.name}
                      </span>
                      <span>
                        <strong>Modelo:</strong> {vehicle.example.name}
                      </span>
                      <span>
                        <strong>Año:</strong> {vehicle.year.name}
                      </span>
                      <span className="flex items-center">
                        <strong>Color:</strong>
                        <span
                          className="ml-2 w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: vehicle.color?.hex || "#fff",
                          }}
                        ></span>
                        <span className="ml-1">{vehicle.color?.name}</span>
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {vehicle.typeCar?.name}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {vehicle.group?.name}
                  </td>
                  <td className="border px-2 py-1">
                    <div>
                      <span>{vehicle.number_soat}</span>
                      <div className="flex flex-col">
                        <span>
                          <strong>F.Vig:</strong> <br />
                          {vehicle.date_soat_issue}
                        </span>
                        <span>
                          <strong>F.Ven:</strong>
                          <br />
                          {vehicle.date_soat_expiration}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center space-x-2 space-y-1">
                    <button
                      onClick={() => handleEditVehicle(vehicle.id)}
                      className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    >
                      <FaEdit className="inline-block mr-1" /> Editar
                    </button>

                    {vehicle.file_technical_review && (
                      <button
                        onClick={() =>
                          handleOpenModal(vehicle.file_technical_review)
                        }
                        className="bg-gray-600 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="inline-block mr-1" /> Revisar
                        Técnico
                      </button>
                    )}

                    {vehicle.file_soat && (
                      <button
                        onClick={() => handleOpenModal(vehicle.file_soat)}
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="inline-block mr-1" /> Ver SOAT
                      </button>
                    )}

                    {vehicle.file_car && (
                      <button
                        onClick={() => handleOpenModal(vehicle.file_car)}
                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaImage className="inline-block mr-1" /> Ver Imagen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Agregar Vehículo */}
      {isAddVehicleModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <AddCar onClose={closeAddVehicleModal} driverId={driverId} />
          </div>
        </div>
      )}

      {/* Modal de Editar Vehículo */}
      {isEditVehicleModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <EditCar
              onClose={closeEditVehicleModal}
              carId={selectedCarId}
              driverId={driverId}
            />
          </div>
        </div>
      )}

      {/* Modal de Archivos */}
      {modalData && modalType !== "edit" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            {modalType === "image" && (
              <img src={modalData} alt="Archivo" className="w-full h-auto" />
            )}
            {modalType === "pdf" && (
              <embed
                src={modalData}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            )}
            {modalType === "other" && (
              <p>Este tipo de archivo no es soportado para vista previa.</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarData;
