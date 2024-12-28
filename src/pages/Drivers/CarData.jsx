import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import {
  FaPlus,
  FaEdit,
  FaFilePdf,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddCar from "./AddCar"; // Formulario para agregar vehículos
import EditCar from "./EditCar"; // Formulario para editar vehículos
import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../../config/config/apiConfig";
import ListInsurances from "../Insurances/ListInsurances";
import ListPermits from "../Permits/ListPermits";
import ListInspections from "../Inspections/ListInspections";

const CarData = ({ driverId }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(null);
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

  // Abrir modal
  const openModal = (type, carId = null) => {
    console.log(type, carId);
    setModalShow(type);
    setSelectedCarId(carId);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalShow(null);
    setSelectedCarId(null);
    fetchCars(); // Recargar la lista de vehículos tras agregar uno nuevo
  };

  // Abrir el modal de agregar vehículo
  // const handleAddVehicle = () => {
  //   setModal(true);
  // };

  // // Cerrar el modal de agregar vehículo
  // const closeAddVehicleModal = () => {
  //   setModal(false);
  //   fetchCars(); // Recargar la lista de vehículos tras agregar uno nuevo
  // };

  // // Abrir el modal de edición de vehículo
  // const handleEditVehicle = (carId) => {
  //   setSelectedCarId(carId);
  //   setModal(true);
  // };

  // // Cerrar el modal de edición de vehículo
  // const closeEditVehicleModal = () => {
  //   setSelectedCarId(null);
  //   setModal(false);
  //   fetchCars(); // Recargar la lista de vehículo tras editar uno
  // };

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
            onClick={() => openModal("addCar")}
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
                        <strong>Placa:</strong> {car.plate || "N/A"}
                      </span>
                      <span>
                        <strong>Motor:</strong> {car.motor || "N/A"}
                      </span>
                      <span>
                        <strong>Chasis:</strong> {car.chassis || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Marca:</strong> {car.brand?.name || "N/A"}
                      </span>
                      <span>
                        <strong>Modelo:</strong> {car.example.name || "N/A"}
                      </span>
                      <span>
                        <strong>Año:</strong> {car.year.name || "N/A"}
                      </span>
                      <span className="flex items-center">
                        <strong>Color:</strong>
                        <span
                          className="ml-2 w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: car.color?.hex || "N/A",
                          }}
                        ></span>
                        <span className="ml-1">{car.color?.name || "N/A"}</span>
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Asociación:</strong> {car.group?.name || "N/A"}
                      </span>
                      <span>
                        <strong>Tipo:</strong> {car.typeCar.name || "N/A"}
                      </span>
                      <span>
                        <strong>N° Asientos:</strong>{" "}
                        {car.number_of_seats || "N/A"}
                      </span>
                    </div>
                  </td>
                  {/* SOAT */}
                  <td className="border px-2 py-1 text-center">
                    <div className="flex flex-col text-left">
                      <span>
                        <strong>N°:</strong>{" "}
                        {car.latest_insurance?.number_insurance || "N/A"}
                      </span>
                      <span>
                        <strong>F.Inicio:</strong>
                        <br />
                        {car.latest_insurance?.issue_date || "N/A"}
                      </span>
                      <span>
                        <strong>F.Expiración: </strong> <br />
                        {car.latest_insurance?.expiration_date || "N/A"}
                      </span>
                      {car.latest_insurance?.is_valid ? (
                        <div className="flex items-center space-x-1 text-green-500">
                          <FaCheckCircle className="text-xl" />
                          <span className="font-semibold">Vigente</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-500">
                          <FaExclamationCircle className="text-xl" />
                          <span className="font-semibold">Vencido</span>
                        </div>
                      )}
                    </div>
                    {car.latest_insurance?.file_insurance && (
                      <a
                        href={car.latest_insurance?.file_insurance}
                        target="_blank"
                        className="inline-flex items-center justify-center w-full bg-orange-600 text-white text-sm my-1 px-2 py-1 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="md:mr-1" />
                        <p className="hidden md:block">SOAT</p>
                      </a>
                    )}
                    <button
                      onClick={() => openModal("insurance", car.id)}
                      className="inline-flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-full text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                      ADMINISTRAR
                    </button>
                  </td>
                  {/* Circulación */}
                  <td className="border px-2 py-1 text-center">
                    <div className="flex flex-col text-left">
                      <span>
                        <strong>F.Inicio:</strong>
                        <br />
                        {car.latest_permit?.issue_date || "N/A"}
                      </span>
                      <span>
                        <strong>F.Expiración: </strong> <br />
                        {car.latest_permit?.expiration_date || "N/A"}
                      </span>
                      {car.latest_permit?.is_valid ? (
                        <div className="flex items-center space-x-1 text-green-500">
                          <FaCheckCircle className="text-xl" />
                          <span className="font-semibold">Vigente</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-500">
                          <FaExclamationCircle className="text-xl" />
                          <span className="font-semibold">Vencido</span>
                        </div>
                      )}
                    </div>
                    {car.latest_permit?.file_permit && (
                      <a
                        href={car.latest_permit?.file_permit}
                        target="_blank"
                        className="inline-flex items-center justify-center w-full bg-green-600 text-white text-sm my-1 px-2 py-1 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="md:mr-1" />
                        <p className="hidden md:block">CIRCULACIÓN</p>
                      </a>
                    )}
                    <button
                      onClick={() => openModal("permit", car.id)}
                      className="inline-flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-full text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                      ADMINISTRAR
                    </button>
                  </td>
                  {/* Inspección */}
                  <td className="border px-2 py-1 text-center">
                    <div className="flex flex-col text-left">
                      <span>
                        <strong>F.Inicio:</strong>
                        <br />
                        {car.latest_inspection?.issue_date || "N/A"}
                      </span>
                      <span>
                        <strong>F.Expiración: </strong> <br />
                        {car.latest_inspection?.expiration_date || "N/A"}
                      </span>
                      {car.latest_inspection?.is_valid ? (
                        <div className="flex items-center space-x-1 text-green-500">
                          <FaCheckCircle className="text-xl" />
                          <span className="font-semibold">Vigente</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-500">
                          <FaExclamationCircle className="text-xl" />
                          <span className="font-semibold">Vencido</span>
                        </div>
                      )}
                    </div>
                    {car.latest_inspection?.file_inspection && (
                      <a
                        href={car.latest_inspection?.file_inspection}
                        target="_blank"
                        className="inline-flex items-center justify-center w-full bg-blue-600 text-white text-sm my-1 px-2 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="md:mr-1" />
                        <p className="hidden md:block">INSPECCIÓN</p>
                      </a>
                    )}
                    <button
                      onClick={() => openModal("inspection", car.id)}
                      className="inline-flex items-center justify-center bg-gray-300 hover:bg-gray-400 w-full text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                      ADMINISTRAR
                    </button>
                  </td>
                  {/* Opciones */}
                  <td className="border px-2 py-1 text-center">
                    <div className="flex justify-center items-center gap-4">
                      {/* Botón para editar */}
                      <button
                        onClick={() => openModal("editCar", car.id)}
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
      {modalShow === "addCar" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <AddCar onClose={closeModal} driverId={driverId} />
          </div>
        </div>
      )}

      {/* Modal de Editar Vehículo */}
      {modalShow === "editCar" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <EditCar
              onClose={closeModal}
              carId={selectedCarId}
              driverId={driverId}
            />
          </div>
        </div>
      )}

      {/* Modal de SOAT */}
      {modalShow === "insurance" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <ListInsurances onClose={closeModal} carId={selectedCarId} />
            {/* <Soat onClose={closeModal} carId={selectedCarId} /> */}
          </div>
        </div>
      )}

      {/* Modal de Permisos */}
      {modalShow === "permit" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <ListPermits onClose={closeModal} carId={selectedCarId} />
          </div>
        </div>
      )}

      {/* Modal de Inspecciones */}
      {modalShow === "inspection" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <ListInspections onClose={closeModal} carId={selectedCarId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarData;
