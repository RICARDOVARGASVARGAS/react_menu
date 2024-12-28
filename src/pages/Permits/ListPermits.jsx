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
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../../config/config/apiConfig";
import { AiOutlineClose } from "react-icons/ai";

const ListPermits = ({ onClose, carId }) => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Estado para mostrar u ocultar el formulario
  const [permitForm, setPermitForm] = useState({
    issue_date: "",
    expiration_date: "",
    file_permit: "",
  });

  const [errors, setErrors] = useState({});

  // Obtener la lista de permisos
  const fetchPermits = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getPermits/${carId}`);
      const { data } = await response.json();
      if (data) {
        setPermits(data);
      } else {
        setPermits([]);
        toast.info("El vehículo no tiene permisos registrados.");
      }
    } catch (error) {
      toast.error("Error al cargar los licencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, [carId]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPermitForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/registerPermit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...permitForm,
          car_id: carId,
        }),
      });

      const { data, message, errors } = await response.json();

      if (data) {
        toast.success(message);
        setShowForm(false);
        setPermitForm({});
        setErrors({});
        fetchPermits();
      } else {
        console.log(errors);
        toast.error(message);
        setErrors(errors);
      }
    } catch (error) {
      console.error("Error al registrar el seguro:", error);
      toast.error("Ocurrió un error al realizar el seguro.");
    } finally {
      setLoading(false);
    }
  };

  // Subir SOAT
  const uploadPermitFile = async (e, permitItem) => {
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
    formFile.append("location", `cars/${carId}/permits/${permitItem.id}`);

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
        permitItem.file_permit = file.url;
        updatePermit(permitItem);
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

  const updatePermit = async (permitData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/updatePermit/${permitData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...permitData,
          }),
        }
      );

      const { data, message, errors } = await response.json();
      if (data) {
        toast.success(message);
        await fetchPermits();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el Permiso.");
    } finally {
      setLoading(false);
    }
  };

  const deletePermit = async (permitId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/deletePermit/${permitId}`, {
        method: "DELETE",
      });

      const { data, message, errors } = await response.json();
      if (data) {
        if (data.file_permit) {
          deletePermitFile(data);
        } else {
          toast.success(message);
          await fetchPermits();
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
  const deletePermitFile = async (permitItem) => {
    setLoading(true);
    const encodedUrl = btoa(permitItem.file_permit);
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
      permitItem.file_permit = null;
      toast.success("Seguro eliminado.");
      await fetchPermits();
      // updatePermit(permitItem);
    } else {
      toast.error(message);
    }

    setLoading(false);
  };
  return (
    <>
      {loading && <Loading />}
      <div className="bg-white shadow rounded-lg overflow-y-auto max-h-[80vh]">
        <div className="p-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <AiOutlineClose size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            Permisos de Circulación{" "}
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
          <div className="p-4 border-t bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Registrar Nuevo Seguro
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <label className="block text-sm font-semibold">
                    Fecha de Emision
                  </label>
                  <input
                    type="date"
                    id="issue_date"
                    name="issue_date"
                    value={permitForm.issue_date || ""}
                    autoComplete="off"
                    onChange={handleChange}
                    className={`mt-1 p-2 w-full border rounded ${
                      errors.issue_date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.issue_date && (
                    <p className="text-red-500 text-sm">{errors.issue_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    id="expiration_date"
                    name="expiration_date"
                    value={permitForm.expiration_date || ""}
                    autoComplete="off"
                    onChange={handleChange}
                    className={`mt-1 p-2 w-full border rounded ${
                      errors.expiration_date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.expiration_date && (
                    <p className="text-red-500 text-sm">
                      {errors.expiration_date}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-4">
                <button
                  type="button"
                  className="bg-gray-600 text-white py-2 px-6 rounded"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded flex items-center gap-2"
                >
                  <FaSave /> Guardar
                </button>
              </div>
            </form>
          </div>
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
                          onChange={(e) => uploadPermitFile(e, { ...permit })}
                          disabled={loading}
                        />
                        <label
                          htmlFor={`permitInput-${permit.id}`} // Ajuste en el for del label
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {loading ? (
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
                  <td className="border px-2 py-1 text-center">
                    {" "}
                    <button
                      onClick={() => deletePermit(permit.id)}
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

export default ListPermits;
