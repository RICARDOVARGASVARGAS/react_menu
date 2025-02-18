import React, { useState } from "react";
import Loading from "../../components/Loading";
import { FaCheck, FaEraser, FaList, FaSave, FaSearch } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiPost, apiFetch } from "../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { API_DATA_PEOPLE_URL } from "../../config/enviroments";
import { useToastHook } from "../../hooks/useToastHook";

const RegisterUser = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      document: "",
      name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const documentNumber = watch("document");

    // Validación del número de documento
    if (!documentNumber || documentNumber.length !== 8) {
      showToast("Por favor, ingrese el número de documento.", "error");
      return;
    }

    setIsSearching(true);

    try {
      const { status, message, information } = await apiFetch(
        `${API_DATA_PEOPLE_URL}/${documentNumber}`
      );

      if (!status) {
        showToast(message, "error");
        reset({
          name: "",
          first_name: "",
          last_name: "",
        });
      } else {
        reset({
          name: information.names,
          first_name: information.father_last_name,
          last_name: information.mother_last_name,
        });
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      showToast(error.message || "Error en la búsqueda.", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const response = await apiPost("user/registerUser", formData);
      const { data, message } = response;

      if (data) {
        onClose();
        showToast(message, "success");
      } else {
        showToast(message, "error");
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

      <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4 mx-auto w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              N° Documento
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="document"
                autoComplete="off"
                className={`border ${
                  errors.document ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2 w-full`}
                placeholder="Ingrese el número de documento"
                {...register("document", {
                  required: {
                    value: true,
                    message: "El Número de Documento es requerido",
                  },
                  minLength: {
                    value: 8,
                    message:
                      "El Número de Documento debe tener al menos 8 caracteres",
                  },
                  maxLength: {
                    value: 8,
                    message:
                      "El Número de Documento debe tener como mucho 8 caracteres",
                  },
                })}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? <Loading size="small" /> : <FaSearch />}
                Buscar
              </button>
            </div>
            {errors.document && (
              <p className="text-red-500 text-sm">{errors.document.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Nombres</label>
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
                  message: "El Nombre es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El Nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message: "El Nombre no debe exceder los 20 caracteres",
                },
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Apellido Paterno
            </label>
            <input
              type="text"
              name="first_name"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.first_name ? "border-red-500" : ""
              }`}
              {...register("first_name", {
                required: {
                  value: true,
                  message: "El Apellido Paterno es requerido",
                },
                minLength: {
                  value: 3,
                  message:
                    "El Apellido Paterno debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message:
                    "El Apellido Paterno no debe exceder los 20 caracteres",
                },
              })}
            />

            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Apellido Materno
            </label>
            <input
              type="text"
              name="last_name"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.last_name ? "border-red-500" : ""
              }`}
              {...register("last_name", {
                required: {
                  value: true,
                  message: "El Apellido Materno es requerido",
                },
                minLength: {
                  value: 3,
                  message:
                    "El Apellido Materno debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message:
                    "El Apellido Materno no debe exceder los 20 caracteres",
                },
              })}
            />

            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Correo Electrónico
            </label>
            <input
              type="text"
              name="email"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: {
                  value: true,
                  message: "El Correo Electrónico es requerido",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "El Correo Electrónico no es válido",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Teléfono (Opcional)
            </label>
            <input
              type="text"
              name="phone_number"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.phone_number ? "border-red-500" : ""
              }`}
              {...register("phone_number", {
                required: {
                  value: false,
                  message: "El Teléfono es requerido",
                },
                minLength: {
                  value: 9,
                  message: "El Teléfono debe tener al menos 9 caracteres",
                },
                maxLength: {
                  value: 12,
                  message: "El Teléfono no debe exceder los 12 caracteres",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "El Teléfono debe ser numérico",
                },
              })}
            />

            {errors.phone_number && (
              <p className="text-red-500 text-sm">
                {errors.phone_number.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6 overflow-x-auto">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
              >
                <FaCheck />
                Guardar
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700"
                onClick={() =>
                  reset({
                    document: "",
                    name: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                  })
                }
              >
                <FaEraser />
                Limpiar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterUser;
