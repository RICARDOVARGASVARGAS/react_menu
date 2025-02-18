import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { FaPlus, FaEdit, FaFilePdf, FaTrash, FaUpload } from "react-icons/fa";
import RegisterLicense from "./RegisterLicense";
import EditLicense from "./EditLicense";
import { apiGet } from "../../services/apiService";
import { useFileUploader, useFileDelete } from "../../hooks/useFileHook";
import { useToastHook } from "../../hooks/useToastHook";

const ListLicenses = ({ driverId }) => {
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [typeModal, setTypeModal] = useState(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
  const { uploadFile, isLoading: isFileUploading } = useFileUploader();
  const { deleteFile, isLoading: isFileDeleting } = useFileDelete();
  const { showToast } = useToastHook();

  useEffect(() => {
    fetchLicenses();
  }, [driverId]);

  // Abrir el modal
  const showModal = (type) => {
    setModal(true);
    setTypeModal(type);
  };

  // Obtener la lista de licencias
  const fetchLicenses = async () => {
    setIsLoading(true);
    try {
      const { data, success } = await apiGet(`getDriverLicenses/${driverId}`);

      if (success) {
        setLicenses(data);
      } else {
        setLicenses([]);
        showToast("El conductor no tiene licencias registradas.", "info");
      }
    } catch (error) {
      showToast("Error al cargar los licencias.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar el modal
  const closeModal = () => {
    setModal(false);
    setTypeModal(null);
    fetchLicenses();
  };

  // Subir la licencia
  const uploadFileLicense = async (e, licenseItem) => {
    const file = e.target.files[0];

    try {
      await uploadFile({
        file,
        model: "License",
        id: licenseItem.id,
        field: "file",
        folder: `Driver/${driverId}/Licenses/${licenseItem.id}`,
        onSuccess: () => {
          fetchLicenses();
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
  const deleteFileLicense = async (licenseItem) => {
    try {
      await deleteFile({
        model: "License",
        id: licenseItem.id,
        field: "file",
        onSuccess: () => {
          fetchLicenses();
        },
        onError: (errorMessage) => {
          showToast(errorMessage || "Error al eliminar la licencia.", "error");
        },
      });
    } catch (error) {
      console.error("Error inesperado al eliminar la licencia:", error);
    }
  };

  return (
    <div>
      {(isLoading || isFileUploading || isFileDeleting) && <Loading />}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Licencias del Conductor
          </h2>
          <button
            onClick={() => showModal("register")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <FaPlus /> Agregar <p className="hidden md:block">Licencia</p>
          </button>
        </div>
        {/* Tabla de licencias */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">N° Licencia</th>
                <th className="border px-2 py-1">Clase</th>
                <th className="border px-2 py-1">Fecha</th>
                <th className="border px-2 py-1">Estado</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id}>
                  <td className="border px-2 py-1 text-center">
                    {license.number}
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>Categoria:</strong> {license.category || "N/A"}
                      </span>
                      <span>
                        <strong>Clase:</strong> {license.class || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-left">
                    <div className="flex flex-col">
                      <span>
                        <strong>F. Inicio:</strong>{" "}
                        {license.issue_date || "No disponible"}
                      </span>
                      <span>
                        <strong>F. Revalidación:</strong>{" "}
                        {license.renewal_date || "No disponible"}
                      </span>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {license.status === "active" ? (
                      <span className="px-2 py-1 rounded-full text-white font-semibold bg-green-500">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-white font-semibold bg-red-500">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <input
                        type="file"
                        id={`licenseInput-${license.id}`} // ID único basado en el ID de la licencia
                        className="hidden"
                        accept="application/pdf"
                        onChange={(e) => uploadFileLicense(e, { ...license })}
                        disabled={isLoading}
                      />
                      {!license.file ? (
                        <label
                          htmlFor={`licenseInput-${license.id}`} // Ajuste en el for del label
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {isLoading ? (
                            "Subiendo..."
                          ) : (
                            <>
                              <FaUpload className="md:mr-1" />
                              <p className="hidden md:block">Subir Licencia</p>
                            </>
                          )}
                        </label>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {/* Botón para ver la licencia */}
                          <a
                            href={license.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            <FaFilePdf className="md:mr-1" />
                            <p className="hidden md:block">Ver</p>
                          </a>

                          {/* Botón para eliminar la licencia */}
                          <button
                            onClick={() => {
                              deleteFileLicense(license);
                            }}
                            className="inline-flex items-center justify-center bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            <FaTrash className="md:mr-1" />
                            <p className="hidden md:block">Eliminar</p>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedLicenseId(license.id);
                          showModal("edit");
                        }}
                        className="inline-flex items-center justify-center bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                      >
                        <FaEdit className="md:mr-1" />
                        <p className="hidden md:block">Editar</p>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal de Agregar Vehículo */}
      {modal && typeModal === "register" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <RegisterLicense onClose={closeModal} driverId={driverId} />
          </div>
        </div>
      )}
      {/* Modal de Editar Vehículo */}
      {modal && typeModal === "edit" && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <EditLicense onClose={closeModal} licenseId={selectedLicenseId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListLicenses;
