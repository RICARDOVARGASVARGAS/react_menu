import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import { FaPlus, FaEdit, FaFilePdf, FaUpload, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddCar from "./AddCar"; // Formulario para agregar vehículos
import EditCar from "./EditCar"; // Formulario para editar vehículos
import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../../config/config/apiConfig";

const CarData = ({ driverId }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(""); // 'edit' o 'image' o 'pdf'
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false); // Estado para el modal de agregar vehículo
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const navigate = useNavigate(); // Para navegación entre páginas

  // Obtener la lista de vehículos
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/getCarsByDriver/${driverId}`
      );
      const result = await response.json();

      if (result.data) {
        setCars(result.data);
      } else {
        setCars([]);
        toast.info("El conductor no tiene vehículos registrados.");
      }
    } catch (error) {
      toast.error("Error al cargar los vehículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [driverId]);

  // Abrir el modal de agregar vehículo
  const handleAddVehicle = () => {
    setIsAddVehicleModalOpen(true);
  };

  // Cerrar el modal de agregar vehículo
  const closeAddVehicleModal = () => {
    setIsAddVehicleModalOpen(false);
    fetchCars(); // Recargar la lista de vehículos tras agregar uno nuevo
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
    fetchCars(); // Recargar la lista de vehículo tras editar uno
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

  // Subir la documento del Vehículo
  const uploadCarFile = async (e, carItem) => {
    e.preventDefault();
    setLoading(true);

    const file = e.target.files[0];

    if (!file) {
      toast.error("Por favor, seleccione un archivo.");
      setLoading(false);
      return;
    }

    // Validar tipo de archivo
    if (file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF.");
      e.target.value = ""; // Limpiar el input
      setLoading(false);
      return;
    }

    // Validar tamaño del archivo (máximo 3 MB)
    const maxSize = 3 * 1024 * 1024; // 3 MB en bytes
    if (file.size > maxSize) {
      toast.error("El archivo excede el tamaño máximo de 3 MB.");
      e.target.value = ""; // Limpiar el input
      setLoading(false);
      return;
    }

    const formFile = new FormData();
    formFile.append("file", file);
    formFile.append("location", `drivers/${driverId}/car/${carItem.id}`);

    try {
      const response = await fetch(`${API_STORAGE_URL}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: TOKEN_API_STORAGE,
        },
        body: formFile,
      });

      const { message, errors, file } = await response.json();

      if (file) {
        carItem.file_car = file.url;
        updateCar(carItem);
      } else {
        toast.error(message || "Ocurrió un error al subir el archivo.");
      }
    } catch (err) {
      toast.error("Ocurrió un error al subir el archivo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (carItem) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/updateCar/${carItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...carItem,
        }),
      });

      const { data, message, errors } = await response.json();
      if (data) {
        toast.success(message);
        await fetchCars();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el Licencia.");
    } finally {
      setLoading(false);
    }
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
                <th className="border px-2 py-1">Detalles</th>
                <th className="border px-2 py-1">Asociación</th>
                <th className="border px-2 py-1">SOAT</th>
                <th className="border px-2 py-1">CIRCULACIÓN</th>
                <th className="border px-2 py-1">INSPECCIÓN</th>
                <th className="border px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Motor:</strong> {car.plate || "No disponible"}
                      </span>
                      <span>
                        <strong>Motor:</strong> {car.motor || "No disponible"}
                      </span>
                      <span>
                        <strong>Chasis:</strong>{" "}
                        {car.chassis || "No disponible"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Marca:</strong>{" "}
                        {car.brand?.name || "No disponible"}
                      </span>
                      <span>
                        <strong>Modelo:</strong>{" "}
                        {car.example.name || "No disponible"}
                      </span>
                      <span>
                        <strong>Año:</strong> {car.year.name || "No disponible"}
                      </span>
                      <span className="flex items-center">
                        <strong>Color:</strong>
                        <span
                          className="ml-2 w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: car.color?.hex || "No disponible",
                          }}
                        ></span>
                        <span className="ml-1">
                          {car.color?.name || "No disponible"}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Asociación:</strong>{" "}
                        {car.group?.name || "No disponible"}
                      </span>
                      <span>
                        <strong>Tipo:</strong>{" "}
                        {car.typeCar.name || "No disponible"}
                      </span>
                      <span>
                        <strong>N° Asientos:</strong>{" "}
                        {car.number_of_seats || "No disponible"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">SOAT</td>
                  <td className="border px-2 py-1">CIRCULACION</td>
                  <td className="border px-2 py-1">INSPECCION</td>
                  <td className="border px-2 py-1 text-center">
                    <div className="flex justify-center items-center gap-4">
                      {/* Botón para editar */}
                      <button
                        onClick={() => handleEditVehicle(car.id)}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaEdit className="inline-block mr-1" /> Editar
                      </button>
                      {/* Botón para subir archivo */}
                      <input
                        type="file"
                        id={`carFileInput-${car.id}`}
                        className="hidden"
                        accept="application/pdf"
                        onChange={(e) => uploadCarFile(e, { ...car })}
                        disabled={loading}
                      />
                      {!car.file_car ? (
                        <label
                          htmlFor={`carFileInput-${car.id}`}
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {loading ? (
                            "Subiendo..."
                          ) : (
                            <>
                              <FaUpload className="md:mr-1" />
                              <p className="hidden md:block">Subir Documento</p>
                            </>
                          )}
                        </label>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <a
                            href={car.file_car}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            <FaFilePdf className="md:mr-1" />
                            <p className="hidden md:block">Ver Documento</p>
                          </a>
                        </div>
                      )}
                    </div>
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
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <EditCar
              onClose={closeEditVehicleModal}
              carId={selectedCarId}
              driverId={driverId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarData;
