import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { FaFileAlt, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut, apiDelete, apiPost } from "../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import DeleteModal from "../../components/elements/DeleteModal";

const EditCar = ({ onClose, carId, driverId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      plate: "",
      chassis: "",
      motor: "",
      brand_id: "",
      type_car_id: "",
      group_id: "",
      year_id: "",
      color_id: "",
      example_id: "",
      group_number: "",
      number_of_seats: "",
      image_car: null,
      file_car: null,
    },
  });

  // Estado único para todas las opciones
  const [options, setOptions] = useState({
    brands: [],
    groups: [],
    years: [],
    colors: [],
    examples: [],
    typeCars: [],
  });

  // Función para actualizar las opciones de forma dinámica
  const updateOptions = (key, data) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: data,
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);

    const response = await apiGet(`getCar/${carId}`);
    const { data, message } = response;
    if (data) {
      reset(data);
    } else {
      toast.error(message || "No se pudieron cargar los datos.");
    }
    setIsLoading(false);
  };

  const fetchOptions = async () => {
    setIsLoading(true);
    // getBrands?page=1&perPage=all&sort=asc
    const endpoints = [
      { key: "brands", url: `getBrands` },
      { key: "typeCars", url: `getTypeCars` },
      { key: "groups", url: `getGroups` },
      { key: "years", url: `getYears` },
      { key: "colors", url: `getColors` },
      { key: "examples", url: "getExamples" },
    ];

    try {
      await Promise.all(
        endpoints.map(async ({ key, url }) => {
          const { data } = await apiGet(url, {
            page: 1,
            perPage: "all",
            sort: "asc",
          });
          updateOptions(key, data || []);
        })
      );
    } catch (error) {
      console.error(`Error en la carga de opciones: ${error.message}`);
      toast.error(
        "Hubo un problema al cargar las opciones. Verifica tu conexión."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchData();
    // fetchOptions();
    const fetchDataAndOptions = async () => {
      try {
        await fetchOptions(); // Primero, obtenemos las opciones
        await fetchData(); // Luego, obtenemos los datos
      } catch (error) {
        console.error("Error fetching data or options:", error);
      }
    };

    fetchDataAndOptions();
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    formData.driver_id = driverId;
    setIsLoading(true);
    try {
      const response = await apiPut(`updateCar/${carId}`, formData);
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

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/deleteCar/${carId}`, {
        method: "DELETE",
      });

      const { message } = await response.json();
      toast.success(message || "Vehículo eliminado.");
      onClose();
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      toast.error("No se pudo eliminar el vehículo.");
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

      <h2 className="text-2xl font-bold mb-4">Editar Vehículo</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Placa</label>
            <input
              type="text"
              name="plate"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.plate ? "border-red-500" : ""
              }`}
              {...register("plate", {
                required: {
                  value: true,
                  message: "El Placa es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El Placa debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message: "El Placa no debe exceder los 20 caracteres",
                },
              })}
            />

            {errors.plate && (
              <p className="text-red-500 text-sm">{errors.plate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">
              N° Motor (Opcional)
            </label>
            <input
              type="text"
              name="motor"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.motor ? "border-red-500" : ""
              }`}
              {...register("motor", {
                required: {
                  value: false,
                  message: "El N° Motor es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El N° Motor debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "El N° Motor no debe exceder los 30 caracteres",
                },
              })}
            />

            {errors.motor && (
              <p className="text-red-500 text-sm">{errors.motor.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">
              N° Chasis (Opcional)
            </label>
            <input
              type="text"
              name="chassis"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.chassis ? "border-red-500" : ""
              }`}
              {...register("chassis", {
                required: {
                  value: false,
                  message: "El N° Chasis es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El N° Chasis debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "El N° Chasis no debe exceder los 30 caracteres",
                },
              })}
            />

            {errors.chassis && (
              <p className="text-red-500 text-sm">{errors.chassis.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">N° Asientos</label>
            <input
              type="number"
              name="number_of_seats"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.number_of_seats ? "border-red-500" : ""
              }`}
              {...register("number_of_seats", {
                required: {
                  value: true,
                  message: "El N° Asientos es requerido",
                },
                min: {
                  value: 1,
                  message: "El N° Asientos debe ser mayor a 0",
                },
                max: {
                  value: 30,
                  message: "El N° Asientos no debe exceder los 30",
                },
              })}
            />
            {errors.number_of_seats && (
              <p className="text-red-500 text-sm">
                {errors.number_of_seats.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Marca</label>
            <select
              id="brand_id"
              name="brand_id"
              className={`mt-1 p-2 w-full border rounded ${
                errors.brand_id ? "border-red-500" : ""
              }`}
              {...register("brand_id", {
                required: {
                  value: true,
                  message: "La Marca es requerida",
                },
              })}
            >
              <option value="">Seleccione una opción</option>
              {options.brands?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand_id && (
              <p className="text-red-500 text-sm">{errors.brand_id.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Modelo/Clase</label>
            <select
              id="example_id"
              name="example_id"
              className={`mt-1 p-2 w-full border rounded ${
                errors.example_id ? "border-red-500" : ""
              }`}
              {...register("example_id", {
                required: {
                  value: true,
                  message: "El Modelo/Clase es requerido",
                },
              })}
            >
              <option value="">Seleccione una opción</option>
              {options.examples?.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.name}
                </option>
              ))}
            </select>
            {errors.example_id && (
              <p className="text-red-500 text-sm">
                {errors.example_id.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Tipo</label>
            <select
              id="type_car_id"
              name="type_car_id"
              className={`mt-1 p-2 w-full border rounded ${
                errors.type_car_id ? "border-red-500" : ""
              }`}
              {...register("type_car_id", {
                required: {
                  value: true,
                  message: "El Tipo es requerido",
                },
              })}
            >
              <option value="">Seleccione una opción</option>
              {options.typeCars?.map((typeCar) => (
                <option key={typeCar.id} value={typeCar.id}>
                  {typeCar.name}
                </option>
              ))}
            </select>
            {errors.type_car_id && (
              <p className="text-red-500 text-sm">
                {errors.type_car_id.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Año</label>
            <select
              id="year_id"
              name="year_id"
              className={`mt-1 p-2 w-full border rounded ${
                errors.year_id ? "border-red-500" : ""
              }`}
              {...register("year_id", {
                required: {
                  value: true,
                  message: "El Anio es requerido",
                },
              })}
            >
              <option value="">Seleccione una opción</option>
              {options.years?.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
            {errors.year_id && (
              <p className="text-red-500 text-sm">{errors.year_id.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Asociación</label>
            <select
              id="group_id"
              name="group_id"
              className={`mt-1 p-2 w-full border rounded ${
                errors.group_id ? "border-red-500" : ""
              }`}
              {...register("group_id", {
                required: {
                  value: true,
                  message: "La Asociación es requerida",
                },
              })}
            >
              <option value="">Seleccione una opción</option>
              {options.groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.group_id && (
              <p className="text-red-500 text-sm">{errors.group_id.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">
              N° Asociación (Opcional)
            </label>
            <input
              type="text"
              name="group_number"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.group_number ? "border-red-500" : ""
              }`}
              {...register("group_number", {
                required: {
                  value: false,
                  message: "El N° Asociación es requerido",
                },
                minLength: {
                  value: 1,
                  message: "El N° Asociación debe ser mayor a 0",
                },
                maxLength: {
                  value: 30,
                  message: "El N° Asociación no debe exceder los 30 Dígitos",
                },
              })}
            />
            {errors.group_number && (
              <p className="text-red-500 text-sm">
                {errors.group_number.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Color</label>
            <select
              id="color_id"
              name="color_id"
              className={`mt-1 p-2 w-full border rounded ${
                errors.color_id ? "border-red-500" : ""
              }`}
              {...register("color_id", {
                required: {
                  value: true,
                  message: "El Color es requerido",
                },
              })}
            >
              <option value="">Seleccione una opción</option>
              {options.colors?.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
            {errors.color_id && (
              <p className="text-red-500 text-sm">{errors.color_id.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded flex items-center gap-2"
          >
            <FaTimes />
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaTrash />
            Eliminar
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
              ¿Estás seguro de que deseas eliminar este vehículo?
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

export default EditCar;
