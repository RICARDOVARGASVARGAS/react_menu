import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEdit,
  FaUpload,
  FaTrashAlt,
  FaEye,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_DATA_PEOPLE_URL } from "../../config/enviroments";
import { apiFetch, apiGet, apiPut } from "../../services/apiService";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useForm } from "react-hook-form";
import { useFileUploader, useFileDelete } from "../../hooks/useFileHook";

const EditDriver = ({ driverId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { uploadFile, isLoading: isFileUploading } = useFileUploader();
  const { deleteFile, isLoading: isFileDeleting } = useFileDelete();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
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
      file_driver: "",
      image: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);

  // Cargar los datos del conductor al iniciar
  useEffect(() => {
    fetchDriverData();
  }, []);

  // Obtener los datos del conductor por ID
  const fetchDriverData = async () => {
    setIsLoading(true);

    const { data, message } = await apiGet(`getDriver/${driverId}`);

    if (data) {
      // console.log(data);
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

  // Subir imagen Perfil
  const uploadFilePhoto = async (e) => {
    const file = e.target.files[0];

    try {
      await uploadFile({
        file: file,
        model: "Driver",
        id: driverId,
        field: "image",
        folder: `Driver/${driverId}/Profile`,
        onSuccess: ({ item, url }) => {
          // Actualiza todos los campos del formulario con el objeto "item"
          // reset(item);
          setValue("image_url", url, { shouldValidate: true });
        },
        onError: (errorMessage) => {
          toast.error(errorMessage || "Error al subir el archivo.");
        },
      });
    } catch (error) {
      console.error("Error inesperado al subir el archivo:", error);
    }
  };

  // Eliminar imagen Perfil
  const deleteFilePhoto = async () => {
    try {
      await deleteFile({
        model: "Driver",
        id: driverId,
        field: "image",
        onSuccess: ({}) => {
          setValue("image_url", null, { shouldValidate: true });
        },
        onError: (errorMessage) => {
          toast.error(errorMessage || "Error al eliminar el archivo.");
        },
      });
    } catch (error) {
      console.error("Error inesperado al eliminar el archivo:", error);
    }
  };

  const uploadFileDriver = async (e) => {
    const file = e.target.files[0];

    try {
      await uploadFile({
        file,
        model: "Driver",
        id: driverId,
        field: "file_driver",
        folder: `Driver/${driverId}/Document`,
        onSuccess: ({ url }) => {
          setValue("file_driver_url", url, { shouldValidate: true });
        },
        onError: (errorMessage) => {
          toast.error(errorMessage || "Error al subir el archivo.");
        },
      });
    } catch (error) {
      console.error("Error inesperado al subir el archivo:", error);
    }
  };

  const deleteFileDriver = async () => {
    try {
      await deleteFile({
        model: "Driver",
        id: driverId,
        field: "file_driver",
        onSuccess: () => {
          setValue("file_driver_url", null, { shouldValidate: true });
        },
        onError: (errorMessage) => {
          toast.error(errorMessage || "Error al eliminar el documento.");
        },
      });
    } catch (error) {
      console.error("Error inesperado al eliminar el documento:", error);
    }
  };

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
      {(isLoading || isFileUploading || isFileDeleting) && <Loading />}
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Editar Datos del Conductor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="col-span-1 flex flex-col items-center">
          <div className="relative flex items-center justify-between">
            <img
              src={watch("image_url") || "/images/no-image.png"}
              alt="Avatar"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border shadow"
            />
            {watch("image_url") ? (
              <button
                onClick={deleteFilePhoto}
                className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600 shadow-md"
              >
                <FaTrashAlt />
              </button>
            ) : (
              <label
                htmlFor="avatarInput"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 shadow-md"
              >
                {isLoading ? "Subiendo..." : <FaUpload />}
              </label>
            )}
            {watch("image_url") && (
              <a
                target="_blank"
                href={watch("image_url")}
                className="absolute bottom-0 left-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 shadow-md"
              >
                <FaEye />
              </a>
            )}
            <input
              type="file"
              id="avatarInput"
              className="hidden"
              accept="image/*"
              onChange={uploadFilePhoto}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={onSubmit}
          className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2 lg:col-span-1">
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

          <div className="sm:col-span-2 lg:col-span-1">
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
          <div className="col-span-full flex flex-col md:flex-row items-center justify-center md:justify-between text-center gap-4 md:gap-0">
            {!watch("file_driver_url") ? (
              <>
                <label
                  htmlFor="file_driver_url"
                  className="inline-flex items-center justify-center cursor-pointer bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  {isLoading ? (
                    "Subiendo..."
                  ) : (
                    <>
                      <FaUpload className="md:mr-1" />
                      <p className="hidden md:block">Subir Documento</p>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id={`file_driver_url`}
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => uploadFileDriver(e)}
                  disabled={isLoading}
                />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Botón para ver */}
                <a
                  href={watch("file_driver_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  <FaFilePdf className="md:mr-1" />
                  <p className="hidden md:block">Ver</p>
                </a>

                {/* Botón para eliminar */}
                <button
                  onClick={deleteFileDriver}
                  className="inline-flex items-center justify-center bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  <FaTrash className="md:mr-1" />
                  <p className="hidden md:block">Eliminar</p>
                </button>
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 shadow-lg"
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
