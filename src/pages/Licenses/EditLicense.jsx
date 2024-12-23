import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { FaSave, FaTrash, FaTimes } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { API_BASE_URL } from "../../config/config/apiConfig";

const EditLicense = ({ onClose, licenseId }) => {
  const navigate = useNavigate();

  // Estado para la carga del formulario
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estado para los datos del formulario
  const [licenseData, setLicenseData] = useState({
    number: "",
    renewal_date: "",
    issue_date: "",
    class: "",
    category: "",
    driver_id: "",
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Cargar los datos del Licencia a editar
  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/getDriverLicense/${licenseId}`
        );
        const { data, message } = await response.json();

        if (data) {
          setLicenseData({
            number: data.number || "",
            renewal_date: data.renewal_date || "",
            issue_date: data.issue_date || "",
            class: data.class || "",
            category: data.category || "",
            driver_id: data.driver_id || "",
          });
        } else {
          toast.error(
            message || "No se pudieron cargar los datos de la Licencia."
          );
        }
      } catch (error) {
        console.error("Error al cargar los datos de la Licencia:", error);
        toast.error("Error al cargar los datos de la Licencia.");
      } finally {
        setLoading(false);
      }
    };

    fetchLicenseData();
  }, [licenseId]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores previos
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/updateDriverLicense/${licenseId}`,
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
        toast.success(message);
        onClose();
      } else {
        setErrors(errors);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el Licencia.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/deleteDriverLicense/${licenseId}`,
        {
          method: "DELETE",
        }
      );

      const { message } = await response.json();
      toast.success(message || "Licencia eliminada.");
      onClose();
    } catch (error) {
      console.error("Error al eliminar la Licencia:", error);
      toast.error("No se pudo eliminar la Licencia.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <AiOutlineClose size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Editar Licencia</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold">N° Licencia</label>
            <input
              type="text"
              id="number"
              name="number"
              value={licenseData.number || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.number ? "border-red-500" : ""
              }`}
            />
            {errors.number && (
              <p className="text-red-500 text-sm">{errors.number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Clase</label>
            <input
              type="text"
              id="class"
              name="class"
              value={licenseData.class || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.class ? "border-red-500" : ""
              }`}
            />
            {errors.class && (
              <p className="text-red-500 text-sm">{errors.class}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Categoría</label>
            <input
              type="text"
              id="category"
              name="category"
              value={licenseData.category || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.category ? "border-red-500" : ""
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">F. Inicio</label>
            <input
              type="date"
              id="issue_date"
              name="issue_date"
              value={licenseData.issue_date || ""}
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
              F. Revalidación
            </label>
            <input
              type="date"
              id="renewal_date"
              name="renewal_date"
              value={licenseData.renewal_date || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.renewal_date ? "border-red-500" : ""
              }`}
            />
            {errors.renewal_date && (
              <p className="text-red-500 text-sm">{errors.renewal_date}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaTrash /> Eliminar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaTimes /> Cerrar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaSave /> Guardar
          </button>
        </div>
      </form>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar esta Licencia?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLicense;
