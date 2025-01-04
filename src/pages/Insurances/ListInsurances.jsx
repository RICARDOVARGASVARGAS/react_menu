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
} from "../../config/enviroments";
import { AiOutlineClose } from "react-icons/ai";

const ListInsurances = ({ onClose, carId }) => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Estado para mostrar u ocultar el formulario
  const [insuranceForm, setInsuranceForm] = useState({
    number_insurance: "",
    issue_date: "",
    expiration_date: "",
    file_insurance: "",
  });

  const [errors, setErrors] = useState({});

  // Obtener la lista de seguros
  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getInsurances/${carId}`);
      const { data } = await response.json();
      if (data) {
        setInsurances(data);
      } else {
        setInsurances([]);
        toast.info("El vehículo no tiene seguros registrados.");
      }
    } catch (error) {
      toast.error("Error al cargar los licencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, [carId]);

  const toggleForm = () => {
    setShowForm(!showForm); // Cambia entre mostrar y ocultar el formulario
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInsuranceForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/registerInsurance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...insuranceForm,
          car_id: carId,
        }),
      });

      const { data, message, errors } = await response.json();

      if (data) {
        toast.success(message);
        setShowForm(false);
        setInsuranceForm({});
        setErrors({});
        fetchInsurances();
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

  const updateInsurance = async (insuranceData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/updateInsurance/${insuranceData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...insuranceData,
          }),
        }
      );

      const { data, message, errors } = await response.json();
      if (data) {
        toast.success(message);
        await fetchInsurances();
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
          <div className="p-4 border-t bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Registrar Nuevo Seguro
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold">N° SOAT</label>
                  <input
                    type="text"
                    id="number_insurance"
                    name="number_insurance"
                    value={insuranceForm.number_insurance || ""}
                    autoComplete="off"
                    onChange={handleChange}
                    className={`mt-1 p-2 w-full border rounded ${
                      errors.number_insurance ? "border-red-500" : ""
                    }`}
                  />
                  {errors.number_insurance && (
                    <p className="text-red-500 text-sm">
                      {errors.number_insurance}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Fecha de Emision
                  </label>
                  <input
                    type="date"
                    id="issue_date"
                    name="issue_date"
                    value={insuranceForm.issue_date || ""}
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
                    value={insuranceForm.expiration_date || ""}
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
                          disabled={loading}
                        />
                        <label
                          htmlFor={`insuranceInput-${insurance.id}`} // Ajuste en el for del label
                          className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        >
                          {loading ? (
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
