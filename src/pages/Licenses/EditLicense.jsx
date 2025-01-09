import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { FaSave, FaTrash, FaTimes } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut, apiDelete } from "../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";

const EditLicense = ({ onClose, licenseId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm({
    defaultValues: {
      number: "",
      class: "",
      category: "",
      issue_date: "",
      renewal_date: "",
    },
  });

  useEffect(() => {
    fetchLicenseData();
  }, [licenseId]);

  const fetchLicenseData = async () => {
    setIsLoading(true);
    const response = await apiGet(`getDriverLicense/${licenseId}`);
    const { data, message } = response;
    if (data) {
      reset(data);
    } else {
      toast.error(message || "No se pudieron cargar los datos.");
    }
    setIsLoading(false);
  };

  // Manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const response = await apiPut(`updateDriverLicense/${licenseId}`, data);
      const { data: updatedData, message } = response;

      if (updatedData) {
        toast.success(message || "Licencia actualizada.");
        onClose();
      } else {
        toast.error(message || "No se pudo actualizar la Licencia.");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  const handleDelete = async () => {
    setIsLoading(true);

    if (watch("file")) {
      toast.error(
        "No se puede eliminar la licencia porque tiene un archivo adjunto."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiDelete(`deleteDriverLicense/${licenseId}`);
      const { data, message } = response;
      if (data) {
        toast.success(message || "Licencia eliminada.");
        onClose();
      } else {
        toast.error(message || "No se pudo eliminar la Licencia.");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
      {isLoading && <Loading />}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <AiOutlineClose size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Editar Licencia</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <label className="block text-sm font-semibold">N° Licencia</label>
            <input
              type="text"
              name="number"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.number ? "border-red-500" : ""
              }`}
              {...register("number", {
                required: {
                  value: true,
                  message: "El N° Licencia es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El N° Licencia debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "El N° Licencia no debe exceder los 30 caracteres",
                },
              })}
            />

            {errors.number && (
              <p className="text-red-500 text-sm">{errors.number.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Clase</label>
            <input
              type="text"
              name="class"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.class ? "border-red-500" : ""
              }`}
              {...register("class", {
                required: {
                  value: true,
                  message: "El Clase es requerido",
                },
                minLength: {
                  value: 2,
                  message: "El Clase debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 10,
                  message: "El Clase no debe exceder los 10 caracteres",
                },
              })}
            />

            {errors.class && (
              <p className="text-red-500 text-sm">{errors.class.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Categoría</label>
            <input
              type="text"
              name="category"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.class ? "border-red-500" : ""
              }`}
              {...register("category", {
                required: {
                  value: true,
                  message: "El Categoría es requerido",
                },
                minLength: {
                  value: 2,
                  message: "El Categoría debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 10,
                  message: "El Categoría no debe exceder los 10 caracteres",
                },
              })}
            />

            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">F. Inicio</label>
            <input
              type="date"
              name="issue_date"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.issue_date ? "border-red-500" : ""
              }`}
              {...register("issue_date", {
                required: {
                  value: true,
                  message: "El Fecha Inicio es requerido",
                },
              })}
            />

            {errors.issue_date && (
              <p className="text-red-500 text-sm">
                {errors.issue_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              F. Revalidación
            </label>
            <input
              type="date"
              name="renewal_date"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.renewal_date ? "border-red-500" : ""
              }`}
              {...register("renewal_date", {
                required: {
                  value: true,
                  message: "El Fecha Revalidación es requerido",
                },
              })}
            />

            {errors.renewal_date && (
              <p className="text-red-500 text-sm">
                {errors.renewal_date.message}
              </p>
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
            <FaSave /> Actualizar
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
