import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPost } from "../../services/apiService";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useForm } from "react-hook-form";
import { useToastHook } from "../../hooks/useToastHook";

const RegisterCar = ({ onClose, driverId }) => {
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
      showToast("Hubo un problema al cargar las opciones.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    formData.driver_id = driverId;
    setIsLoading(true);
    try {
      const response = await apiPost("registerCar", formData);
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

      <h2 className="text-2xl font-bold mb-4">Registrar Vehículo</h2>

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
            <FaSave /> Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterCar;
