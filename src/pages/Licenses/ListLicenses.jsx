import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading"; // Componente de carga
import {
  FaPlus,
  FaEdit,
  FaFilePdf,
  FaImage,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../../config/config/apiConfig";
import RegisterLicense from "./RegisterLicense";
import EditLicense from "./EditLicense";

const ListLicenses = ({ driverId }) => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [typeModal, setTypeModal] = useState(null);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);

  const navigate = useNavigate(); // Para navegación entre páginas

  // Obtener la lista de licencias
  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/getDriverLicenses/${driverId}`
      );
      const { data } = await response.json();
      //   console.log(data);
      if (data) {
        setLicenses(data);
      } else {
        setLicenses([]);
        toast.info("El conductor no tiene licencias registradas.");
      }
    } catch (error) {
      toast.error("Error al cargar los licencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [driverId]);

  // Abrir el modal
  const showModal = (type) => {
    setModal(true);
    setTypeModal(type);
  };

  // Cerrar el modal
  const closeModal = () => {
    setModal(false);
    setTypeModal(null);
    fetchLicenses();
  };

  // Licencias
  // useEffect(() => {
  //   // Subir la imagen del conductor
  //   if (formItem.image && imageStatus) {
  //     handleSubmit();
  //     setImageStatus(false);
  //   }
  //   // Eliminar la imagen del conductor
  //   if (!formItem.image && imageStatus) {
  //     handleSubmit();
  //     setImageStatus(false);
  //   }
  // }, [formItem.image]);

  // Subir la imagen del conductor
  const uploadLicenseFile = async (e, licenseItem) => {
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
    formFile.append(
      "location",
      `drivers/${driverId}/licenses/${licenseItem.id}`
    );

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
        licenseItem.file = file.url;
        updateLicense(licenseItem);
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

  // Eliminar la imagen del conductor
  const deleteLicenseFile = async (licenseItem) => {
    setLoading(true);
    const encodedUrl = btoa(licenseItem.file);
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
      licenseItem.file = null;
      updateLicense(licenseItem);
    } else {
      toast.error(message);
    }

    setLoading(false);
  };

  // if (loading) {
  //   return <Loading />;
  // }

  const updateLicense = async (licenseData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/updateDriverLicense/${licenseData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...licenseData,
          }),
        }
      );

      const { data, message, errors } = await response.json();
      if (data) {
        console.log(data);
        console.log(data.id);
        toast.success(message);
        await fetchLicenses();
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

  return (
    <div>
      {loading && <Loading />}
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
                        onChange={(e) => uploadLicenseFile(e, { ...license })}
                        disabled={loading}
                      />
                      {!license.file ? (
                        <label
                          htmlFor={`licenseInput-${license.id}`} // Ajuste en el for del label
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {loading ? (
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
                            href={license.file}
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
                              deleteLicenseFile(license);
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
