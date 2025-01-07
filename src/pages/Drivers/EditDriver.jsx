import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaEdit, FaUpload, FaTrashAlt, FaEye } from "react-icons/fa";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_DATA_PEOPLE_URL } from "../../config/enviroments";
import {
  apiFetch,
  apiGet,
  apiPut,
  uploadFileStorage,
} from "../../services/apiService";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useForm } from "react-hook-form";

const EditDriver = ({ driverId }) => {
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
      document_type: "dni",
      document_number: "",
      name: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      email: "",
      phone_number: "",
      address: "",
      gender: "M",
    },
  });

  const [isSearching, setIsSearching] = useState(false);

  // Cargar los datos del conductor al iniciar
  useEffect(() => {
    if (driverId) {
      fetchDriverData();
    }
  }, [driverId]);

  // Obtener los datos del conductor por ID
  const fetchDriverData = async () => {
    setIsLoading(true);

    const { data, message } = await apiGet(`getDriver/${driverId}`);

    if (data) {
      reset(data);
    } else {
      toast.error(message || "No se pudieron cargar los datos.");
    }

    setIsLoading(false);
  };

  // Buscar información del conductor usando el número de documento
  const handleSearch = async () => {
    const documentNumber = watch("document_number");

    // Validación del número de documento
    if (!documentNumber || documentNumber.length !== 8) {
      toast.error("Por favor, ingrese el número de documento.");
      return;
    }

    setIsSearching(true);

    try {
      const { status, message, information } = await apiFetch(
        `${API_DATA_PEOPLE_URL}/${documentNumber}`
      );

      if (!status) {
        toast.error(message);
        reset({
          document_type: "dni",
          document_number: "",
          name: "",
          first_name: "",
          last_name: "",
          birth_date: "",
          email: "",
          phone_number: "",
          address: "",
          gender: "M",
        });
      } else {
        reset({
          name: information.names,
          first_name: information.father_last_name,
          last_name: information.mother_last_name,
          birth_date: information.birthday,
        });
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      toast.error(error.message || "Error en la búsqueda.");
    } finally {
      setIsSearching(false);
    }
  };

  // Enviar los datos actualizados del conductor
  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);

    try {
      const { data, message } = await apiPut(
        `updateDriver/${driverId}`,
        formData
      );

      if (data) {
        reset(data);
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

  const uploadFile = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];

    if (!file) {
      toast.error("Por favor, seleccione una imagen.");
      return;
    }

    try {
      const {
        message,
        file: document,
        item,
      } = await uploadFileStorage(
        file,
        "Driver",
        driverId,
        "image",
        `Profile/${driverId}`
      );

      if (item) {
        toast.success(message);
        reset({
          image: item.image,
        });
      } else {
        toast.error(message);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
      {isLoading && <Loading />}
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Editar Datos del Conductor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="col-span-1 flex flex-col items-center">
          <div className="relative">
            <img
              src={watch("image") || "/src/assets/no-image.png"}
              alt="Avatar"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border shadow"
            />
            <label
              htmlFor="avatarInput"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 shadow-md"
            >
              {isLoading ? "Subiendo..." : <FaUpload />}
            </label>
            <input
              type="file"
              id="avatarInput"
              className="hidden"
              accept="image/*"
              onChange={uploadFile}
              disabled={isLoading}
            />
          </div>
          {watch("image") && (
            <a
              target="_blank"
              href={watch("image")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 shadow"
            >
              <FaEye />
              Ver Imagen
            </a>
          )}
        </div>

        {/* Form Section */}
        <form
          onSubmit={onSubmit}
          className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Tipo de Documento
            </label>
            <select
              name="document_type"
              className={`border ${
                errors.document_type ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2 w-full`}
              {...register("document_type", {
                required: {
                  value: true,
                  message: "El Tipo de Documento es requerido",
                },
              })}
            >
              <option value="dni">DNI</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
            {errors.document_type && (
              <p className="text-red-500 text-sm">
                {errors.document_type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Número de Documento
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="document_number"
                autoComplete="off"
                className={`border ${
                  errors.document_number ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2 w-full`}
                placeholder="Ingrese el número de documento"
                {...register("document_number", {
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
            {errors.document_number && (
              <p className="text-red-500 text-sm">
                {errors.document_number.message}
              </p>
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
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birth_date"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.birth_date ? "border-red-500" : ""
              }`}
              {...register("birth_date", {
                required: {
                  value: true,
                  message: "La Fecha de Nacimiento es requerida",
                },
              })}
            />

            {errors.birth_date && (
              <p className="text-red-500 text-sm">
                {errors.birth_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Genero
            </label>
            <select
              name="gender"
              className={`border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2 w-full`}
              {...register("gender", {
                required: {
                  value: true,
                  message: "El Genero es requerido",
                },
              })}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Correo Electrónico (Opcional)
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
                  value: false,
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

          <div>
            <label className="block text-sm font-semibold">
              Dirección (Opcional)
            </label>
            <input
              type="text"
              name="address"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.address ? "border-red-500" : ""
              }`}
              {...register("address", {
                required: {
                  value: false,
                  message: "La Dirección es requerida",
                },
                minLength: {
                  value: 3,
                  message: "La Dirección debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "La Dirección no debe exceder los 100 caracteres",
                },
              })}
            />

            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
          {/* Botón Actualizar */}
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 shadow-lg"
            >
              <FaEdit />
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
