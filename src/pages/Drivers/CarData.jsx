import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import { FaPlus, FaEdit, FaImage, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CarData = ({ driverId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(""); // 'image' o 'pdf'
  const navigate = useNavigate(); // Para navegación entre páginas

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://secov_back.test/api/getCarsByDriver/${driverId}`
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

  const handleAddVehicle = () => {
    navigate(`/add-car?driverId=${driverId}`);
  };

  const handleEditVehicle = (vehicleId) => {
    navigate(`/edit-car/${vehicleId}`);
  };

  const getFileType = (url) => {
    if (url) {
      const ext = url.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
      if (ext === "pdf") return "pdf";
      return "other"; // Para otros tipos de archivo, como Excel o Word
    }
    return null;
  };

  const handleOpenModal = (url) => {
    const type = getFileType(url);
    setModalData(url);
    setModalType(type);
  };

  const closeModal = () => {
    setModalData(null);
    setModalType("");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
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
                        <strong>Chassis:</strong> {vehicle.chassis}
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
                  <td className="border px-2 py-1 text-center">
                    {/* Botón Editar */}
                    <button
                      onClick={() => handleEditVehicle(vehicle.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                    >
                      <FaEdit /> Editar
                    </button>
                    {/* Condicional para el botón de Ver Foto */}
                    {vehicle.file_car && vehicle.file_car !== "" ? (
                      <button
                        onClick={() => handleOpenModal(vehicle.file_car)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                      >
                        <FaImage /> Ver Foto
                      </button>
                    ) : null}{" "}
                    {/* Si file_car está vacío, el botón no se renderiza */}
                    {/* Condicional para el botón de Ver SOAT */}
                    {vehicle.file_soat && vehicle.file_soat !== "" ? (
                      <button
                        onClick={() => handleOpenModal(vehicle.file_soat)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <FaFilePdf /> Ver SOAT
                      </button>
                    ) : null}{" "}
                    {/* Si file_soat está vacío, el botón no se renderiza */}
                    {/* Condicional para el botón de Ver Revisión Técnica */}
                    {vehicle.file_technical_review &&
                    vehicle.file_technical_review !== "" ? (
                      <button
                        onClick={() =>
                          handleOpenModal(vehicle.file_technical_review)
                        }
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 flex items-center gap-1"
                      >
                        <FaFilePdf /> Ver Revisión Técnica
                      </button>
                    ) : null}{" "}
                    {/* Si file_technical_review está vacío, el botón no se renderiza */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-3xl w-full mx-4 sm:mx-auto sm:max-w-lg md:max-w-3xl">
            {/* Botón de cierre mejorado */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl p-2 bg-gray-200 rounded-full shadow-md transition duration-200 ease-in-out"
            >
              <span className="font-semibold">×</span> {/* X en vez de texto */}
            </button>

            {/* Contenido del Modal */}
            {modalType === "image" ? (
              <div className="flex justify-center">
                <img
                  src={modalData}
                  alt="Imagen del vehículo"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            ) : modalType === "pdf" ? (
              <div className="flex justify-center">
                <embed
                  src={modalData}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <p>No se puede visualizar el archivo en este formato.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarData;
