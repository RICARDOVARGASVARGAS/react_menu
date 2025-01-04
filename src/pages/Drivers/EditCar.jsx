import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // Indicador de carga
import { FaFileAlt, FaSave, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import {
  API_BASE_URL,
  API_STORAGE_URL,
  TOKEN_API_STORAGE,
} from "../../config/enviroments";

const EditCar = ({ onClose, carId, driverId }) => {
  const navigate = useNavigate();

  // Estado para la carga del formulario
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estado para los datos del formulario
  const [carData, setCarData] = useState({
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
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Estados para las opciones de los selects
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [years, setYears] = useState([]);
  const [colors, setColors] = useState([]);
  const [examples, setExamples] = useState([]);
  const [typeCars, setTypeCars] = useState([]);

  // Cargar las opciones para los selects al montar el componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);

        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer tu_token_aqui", // Reemplaza con tu token real
        };

        // Realizar todas las solicitudes simultáneamente
        const [
          brandsRes,
          typesRes,
          groupsRes,
          yearsRes,
          colorsRes,
          examplesRes,
          typeCarsRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/getBrands?page=1&perPage=all&sort=asc`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/getTypeCars?page=1&perPage=all&sort=asc`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/getGroups?page=1&perPage=all&sort=asc`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/getYears?page=1&perPage=all&sort=asc`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/getColors?page=1&perPage=all&sort=asc`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/getExamples?page=1&perPage=all&sort=asc`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/getTypeCars?page=1&perPage=all&sort=asc`, {
            headers,
          }),
        ]);

        setBrands((await brandsRes.json()).data || []);
        setTypes((await typesRes.json()).data || []);
        setGroups((await groupsRes.json()).data || []);
        setYears((await yearsRes.json()).data || []);
        setColors((await colorsRes.json()).data || []);
        setExamples((await examplesRes.json()).data || []);
        setTypeCars((await typeCarsRes.json()).data || []);

        toast.success("Opciones cargadas correctamente.");
      } catch (error) {
        console.error("Error al cargar las opciones:", error);
        toast.error("Error al cargar las opciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Cargar los datos del vehículo a editar
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/getCar/${carId}`);
        const { data, message } = await response.json();

        if (data) {
          setCarData({
            plate: data.plate || "",
            chassis: data.chassis || "",
            motor: data.motor || "",
            brand_id: data.brand_id || "",
            type_car_id: data.type_car_id || "",
            group_id: data.group_id || "",
            year_id: data.year_id || "",
            color_id: data.color_id || "",
            example_id: data.example_id || "",
            group_number: data.group_number || "",
            number_of_seats: data.number_of_seats || "",
            image_car: data.image_car || null,
            file_car: data.file_car || null,
          });
        } else {
          toast.error(
            message || "No se pudieron cargar los datos del vehículo."
          );
        }
      } catch (error) {
        console.error("Error al cargar los datos del vehículo:", error);
        toast.error("Error al cargar los datos del vehículo.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/updateCar/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...carData,
          driver_id: driverId,
        }),
      });

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
      toast.error("Error al actualizar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  const deleteCarFile = async () => {
    setLoading(true);
    const encodedUrl = btoa(carData.file_car);
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
      carData.file_car = null;
      updateCar();
    } else {
      // console.log(errors);
      toast.error(message);
    }

    setLoading(false);
  };

  const updateCar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/updateCar/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...carData,
          driver_id: driverId,
        }),
      });

      const { data, message, errors } = await response.json();
      if (data) {
        toast.success(message);
        // await fetchCars();
      } else {
        console.log(errors);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el Licencia.");
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

      <h2 className="text-2xl font-bold mb-4">Editar Vehículo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Placa</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={carData.plate || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.plate ? "border-red-500" : ""
              }`}
            />
            {errors.plate && (
              <p className="text-red-500 text-sm">{errors.plate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">N° Motor</label>
            <input
              type="text"
              id="motor"
              name="motor"
              value={carData.motor || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.motor ? "border-red-500" : ""
              }`}
            />
            {errors.motor && (
              <p className="text-red-500 text-sm">{errors.motor}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">N° Chasis</label>
            <input
              type="text"
              id="chassis"
              name="chassis"
              value={carData.chassis || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.chassis ? "border-red-500" : ""
              }`}
            />
            {errors.chassis && (
              <p className="text-red-500 text-sm">{errors.chassis}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">N° Asientos</label>
            <input
              type="number"
              id="number_of_seats"
              name="number_of_seats"
              value={carData.number_of_seats || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.number_of_seats ? "border-red-500" : ""
              }`}
            />
            {errors.number_of_seats && (
              <p className="text-red-500 text-sm">{errors.number_of_seats}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Marca</label>
            <select
              id="brand_id"
              name="brand_id"
              value={carData.brand_id}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.brand_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione una opción</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand_id && (
              <p className="text-red-500 text-sm">{errors.brand_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Modelo/Clase</label>
            <select
              id="example_id"
              name="example_id"
              value={carData.example_id}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.example_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione una opción</option>
              {examples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.name}
                </option>
              ))}
            </select>
            {errors.example_id && (
              <p className="text-red-500 text-sm">{errors.example_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Tipo</label>
            <select
              id="type_car_id"
              name="type_car_id"
              value={carData.type_car_id}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.type_car_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione una opción</option>
              {typeCars.map((typeCar) => (
                <option key={typeCar.id} value={typeCar.id}>
                  {typeCar.name}
                </option>
              ))}
            </select>
            {errors.type_car_id && (
              <p className="text-red-500 text-sm">{errors.type_car_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Año</label>
            <select
              id="year_id"
              name="year_id"
              value={carData.year_id}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.year_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione una opción</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
            {errors.year_id && (
              <p className="text-red-500 text-sm">{errors.year_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Asociación</label>
            <select
              id="group_id"
              name="group_id"
              value={carData.group_id}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.group_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione una opción</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.group_id && (
              <p className="text-red-500 text-sm">{errors.group_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              N° Asociación <span className="text-gray-400">(Opcional)</span>
            </label>
            <input
              type="text"
              id="group_number"
              name="group_number"
              value={carData.group_number || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.group_number ? "border-red-500" : ""
              }`}
            />
            {errors.group_number && (
              <p className="text-red-500 text-sm">{errors.group_number}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">Color</label>
            <select
              id="color_id"
              name="color_id"
              value={carData.color_id}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.color_id ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccione una opción</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
            {errors.color_id && (
              <p className="text-red-500 text-sm">{errors.color_id}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          {carData.file_car && (
            <button
              type="button"
              onClick={() => deleteCarFile()}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded flex items-center gap-2"
            >
              <FaFileAlt />
              Eliminar Documento
            </button>
          )}
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
