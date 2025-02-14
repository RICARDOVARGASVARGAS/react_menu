import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
import { apiDelete, apiGet } from "../../services/apiService";
import { useFileUploader, useFileDelete } from "../../hooks/useFileHook";
import RegisterPermit from "./RegisterPermit";

const ListPermits = ({ onClose, carId }) => {
  const [permits, setPermits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { uploadFile, isLoading: isFileUploading } = useFileUploader();
  const { deleteFile, isLoading: isFileDeleting } = useFileDelete();

  // Obtener la lista de seguros
  const fetchItems = async () => {
    setIsLoading(true);
    const { data } = await apiGet(`getPermits/${carId}`);
    setPermits(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Subir Inspeccion
  const uploadFileDocument = async (e, item) => {
    const file = e.target.files[0];
    try {
      await uploadFile({
        file,
        model: "Permit",
        model_id: item.id,
        model_storage: "file_permit",
        storage: `Car/${carId}/Permit/${item.id}`,
        onSuccess: (uploadedFile) => {
          fetchItems();
        },
        onError: (errorMessage) => {
          toast.error(errorMessage || "Error al subir el archivo.");
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
        model: "Permit",
        model_id: item.id,
        model_storage: "file_permit",
        uuid: uuid,
        onSuccess: (data) => {
          toast.success("Elemento eliminado con éxito.");
          fetchItems();
        },
        onError: (errorMessage) => {
          toast.error(errorMessage || "Error al eliminar el Elemento.");
        },
      });
    } catch (error) {
      console.error("Error inesperado al eliminar el Elemento:", error);
    }
  };

  const handleDelete = async (item) => {
    setIsLoading(true);
    if (item.file_permit) {
      toast.error("No se puede eliminar  porque tiene un archivo adjunto.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiDelete(`deletePermit/${item.id}`);
      const { data, message } = response;
      if (data) {
        toast.success(message || "Elemento eliminado.");
        fetchItems();
      } else {
        toast.error(message || "No se pudo eliminar el Elemento.");
      }
    } catch (error) {
      toast.error("No se pudo eliminar el Elemento.");
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
            Permisos de Circulación
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
                <span>Registrar Nuevo Permiso</span>
              </>
            )}
          </button>
        </div>
        {/* Formulario de registro */}
        {showForm && (
          <RegisterPermit
            toggleForm={toggleForm}
            cardId={carId}
            setIsLoading={setIsLoading}
            fetchItems={fetchItems}
          />
        )}
        {/* Tabla de permisos */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Circulación</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permits.map((permit) => (
                <tr key={permit.id}>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>F. Inicio:</strong> {permit.issue_date || "N/A"}
                      </span>
                      <span>
                        <strong>F. Revalidación:</strong>{" "}
                        {permit.renewal_date || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {permit.status ? (
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

                    {permit.file_permit ? (
                      <a
                        href={permit.file_permit}
                        target="_blank"
                        className="inline-flex items-center justify-center w-full bg-green-600 text-white text-sm my-1 px-2 py-1 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaFilePdf className="md:mr-1" />
                        <p className="hidden md:block">CIRCULACIÓN</p>
                      </a>
                    ) : (
                      <>
                        <input
                          type="file"
                          id={`permitInput-${permit.id}`} // ID único basado en el ID de la licencia
                          className="hidden"
                          accept="application/pdf"
                          onChange={(e) => uploadFileDocument(e, { ...permit })}
                          disabled={isLoading}
                        />
                        <label
                          htmlFor={`permitInput-${permit.id}`} // Ajuste en el for del label
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {isLoading ? (
                            "Subiendo..."
                          ) : (
                            <>
                              <FaUpload className="md:mr-1" />
                              <p className="hidden md:block">Subir Permiso</p>
                            </>
                          )}
                        </label>
                      </>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(permit)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                    >
                      Eliminar Permiso
                    </button>
                    {permit.file_permit && (
                      <button
                        onClick={() => deleteFileDocument(permit)}
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

export default ListPermits;
