import React, { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiPost } from "../../services/apiService";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useForm } from "react-hook-form";

const RegisterLicense = ({ onClose, driverId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    formData.driver_id = driverId;
    try {
      const response = await apiPost("registerDriverLicense", formData);
      const { data, message } = response;

      if (data) {
        onClose();
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
      {isLoading && <Loading />}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <AiOutlineClose size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Registrar Vehículo</h2>

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
            onClick={onClose}
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
  );
};

export default RegisterLicense;
