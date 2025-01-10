import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import {
  FaPlus,
  FaEdit,
  FaFilePdf,
  FaImage,
  FaTrash,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import RegisterInsurance from "./RegisterInsurance";
import { apiGet } from "../../services/apiService";

const ListInsurances = ({ onClose, carId }) => {
  const [insurances, setInsurances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Obtener la lista de seguros
  const fetchItems = async () => {
    setIsLoading(true);
    const { data } = await apiGet(`getInsurances/${carId}`);
    setInsurances(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Subir SOAT
  const uploadInsuranceFile = async (e, insuranceItem) => {
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
    formFile.append("location", `cars/${carId}/insurances/${insuranceItem.id}`);

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
        insuranceItem.file_insurance = file.url;
        updateInsurance(insuranceItem);
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

  const deleteInsurance = async (insuranceId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/deleteInsurance/${insuranceId}`,
        {
          method: "DELETE",
        }
      );

      const { data, message, errors } = await response.json();
      if (data) {
        if (data.file_insurance) {
          deleteInsuranceFile(data);
        } else {
          toast.success(message);
          await fetchInsurances();
        }
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el seguro.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar el seguro
  const deleteInsuranceFile = async (insuranceItem) => {
    setLoading(true);
    const encodedUrl = btoa(insuranceItem.file_insurance);
    const response = await fetch(`${API_STORAGE_URL}/files/${encodedUrl}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: TOKEN_API_STORAGE,
      },
      body: JSON.stringify({}),
    });

    const { file, message, errors } = await response.json();
    if (file) {
      insuranceItem.file_insurance = null;
      toast.success("Seguro eliminado.");
      await fetchInsurances();
      // updateInsurance(insuranceItem);
    } else {
      toast.error(message);
    }

    setLoading(false);
  };
  return (
    <>
      {isLoading && <Loading />}
      <div className="bg-white shadow rounded-lg overflow-y-auto max-h-[80vh]">
        <div className="p-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <AiOutlineClose size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            Seguros del Vehículo
          </h2>
          <button
            onClick={toggleForm}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            {showForm ? (
              <>
                <FaTimes size={20} />
                <span>Cerrar</span>
              </>
            ) : (
              <>
                <FaPlus size={20} />
                <span>Registrar Nuevo Seguro</span>
              </>
            )}
          </button>
        </div>
        {/* Formulario de registro */}
        {showForm && (
          <RegisterInsurance
            toggleForm={toggleForm}
            cardId={carId}
            setIsLoading={setIsLoading}
            fetchItems={fetchItems}
          />
        )}
        {/* Tabla de seguros */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">N° Seguro</th>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Seguro</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {insurances.map((insurance) => (
                <tr key={insurance.id}>
                  <td className="border px-2 py-1 text-center font-bold">
                    {insurance.number_insurance}
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>F. Inicio:</strong>{" "}
                        {insurance.issue_date || "N/A"}
                      </span>
                      <span>
                        <strong>F. Revalidación:</strong>{" "}
                        {insurance.renewal_date || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {insurance.status ? (
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

                    {insurance.file_insurance ? (
                      <a
                        href={insurance.file_insurance}
                        target="_blank"
                        className="inline-flex items-center justify-center w-full bg-orange-600 text-white text-sm my-1 px-2 py-1 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="md:mr-1" />
                        <p className="hidden md:block">SOAT</p>
                      </a>
                    ) : (
                      <>
                        <input
                          type="file"
                          id={`insuranceInput-${insurance.id}`} // ID único basado en el ID de la licencia
                          className="hidden"
                          accept="application/pdf"
                          onChange={(e) =>
                            uploadInsuranceFile(e, { ...insurance })
                          }
                          disabled={isLoading}
                        />
                        <label
                          htmlFor={`insuranceInput-${insurance.id}`} // Ajuste en el for del label
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {isLoading ? (
                            "Subiendo..."
                          ) : (
                            <>
                              <FaUpload className="md:mr-1" />
                              <p className="hidden md:block">Subir SOAT</p>
                            </>
                          )}
                        </label>
                      </>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {" "}
                    <button
                      onClick={() => deleteInsurance(insurance.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListInsurances;
