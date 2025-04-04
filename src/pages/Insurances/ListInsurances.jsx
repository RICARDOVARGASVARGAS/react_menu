import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import {
  FaPlus,
  FaFilePdf,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import RegisterInsurance from "./RegisterInsurance";
import { apiDelete, apiGet } from "../../services/apiService";
import { useFileUploader, useFileDelete } from "../../hooks/useFileHook";
import { useToastHook } from "../../hooks/useToastHook";

const ListInsurances = ({ onClose, carId }) => {
  const [insurances, setInsurances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { uploadFile, isLoading: isFileUploading } = useFileUploader();
  const { deleteFile, isLoading: isFileDeleting } = useFileDelete();
  const { showToast } = useToastHook();

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
  const uploadFileDocument = async (e, item) => {
    const file = e.target.files[0];

    try {
      await uploadFile({
        file,
        model: "Insurance",
        id: item.id,
        field: "file_insurance",
        folder: `Car/${carId}/Insurance/${item.id}`,
        onSuccess: () => {
          fetchItems();
        },
        onError: (errorMessage) => {
          showToast(errorMessage || "Error al subir el archivo.", "error");
        },
      });
    } catch (error) {
      console.error("Error inesperado al subir el archivo:", error);
    }
  };

  // Eliminar la licencia
  const deleteFileDocument = async (item) => {
    try {
      await deleteFile({
        model: "Insurance",
        id: item.id,
        field: "file_insurance",
        onSuccess: () => {
          fetchItems();
        },
        onError: (errorMessage) => {
          showToast(errorMessage || "Error al eliminar el Elemento.", "error");
        },
      });
    } catch (error) {
      console.error("Error inesperado al eliminar el Seguro:", error);
    }
  };

  const handleDelete = async (item) => {
    setIsLoading(true);
    try {
      const response = await apiDelete(`deleteInsurance/${item.id}`);
      const { message, success } = response;
      if (success) {
        showToast(message || "Elemento eliminado.", "success");
        fetchItems();
      } else {
        showToast(message || "No se pudo eliminar el Elemento.", "error");
      }
    } catch (error) {
      showToast("No se pudo eliminar el Elemento.", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
                        href={insurance.file_insurance_url}
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
                            uploadFileDocument(e, { ...insurance })
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
                  <td className="border px-2 py-1 text-center flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(insurance)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                    >
                      Eliminar SOAT
                    </button>
                    {insurance.file_insurance && (
                      <button
                        onClick={() => deleteFileDocument(insurance)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                      >
                        Eliminar Documento
                      </button>
                    )}
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
