import React, { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { handleBackendErrors } from "../../../utils/handleBackendErrors ";
import { apiPost } from "../../../services/apiService";
import { useForm } from "react-hook-form";

const RegisterColor = ({ onClose }) => {
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
      hex: "#000000",
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const response = await apiPost("registerColor", formData);
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

      <h2 className="text-2xl font-bold mb-4">Registrar Color</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <label className="block text-sm font-semibold">Color</label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name", {
                required: {
                  value: true,
                  message: "El Color es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El Color debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El Color no debe exceder los 50 caracteres",
                },
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">HEX</label>
            <input
              type="color"
              name="hex"
              autoComplete="off"
              className={`mt-1 p-1 h-10 w-full border rounded ${
                errors.hex ? "border-red-500" : ""
              }`}
              {...register("hex", {
                required: {
                  value: true,
                  message: "El Hex es requerido",
                },
              })}
            />

            {errors.hex && (
              <p className="text-red-500 text-sm">{errors.hex.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-600 text-white py-2 px-6 rounded"
          >
            Limpiar
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

export default RegisterColor;
