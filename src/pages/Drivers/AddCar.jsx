import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // Indicador de carga
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import {API_BASE_URL} from "../../config/config/apiConfig";

/**
 * Componente para agregar un nuevo vehículo
 * @param {Function} onClose - Función para cerrar el modal
 */
const AddCar = ({ onClose, driverId }) => {
  const navigate = useNavigate();

  // Estado para la carga del formulario
  const [loading, setLoading] = useState(false);

  // Estado para los datos del formulario
  const [carData, setCarData] = useState({
    plate: "",
    chassis: "",
    motor: "",
    file_car: "",
    brand_id: "",
    type_car_id: "",
    group_id: "",
    year_id: "",
    color_id: "",
    example_id: "",
    number_soat: "",
    date_soat_issue: "",
    date_soat_expiration: "",
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
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/getBrands?page=1&perPage=all&sort=asc`,
            { headers }
          ),
          fetch(
            `${API_BASE_URL}/getTypeCars?page=1&perPage=all&sort=asc`,
            { headers }
          ),
          fetch(
            `${API_BASE_URL}/getGroups?page=1&perPage=all&sort=asc`,
            { headers }
          ),
          fetch(
            `${API_BASE_URL}/getYears?page=1&perPage=all&sort=asc`,
            { headers }
          ),
          fetch(
            `${API_BASE_URL}/getColors?page=1&perPage=all&sort=asc`,
            { headers }
          ),
          fetch(
            `${API_BASE_URL}/getExamples?page=1&perPage=all&sort=asc`,
            { headers }
          ),
        ]);

        setBrands((await brandsRes.json()).data || []);
        setTypes((await typesRes.json()).data || []);
        setGroups((await groupsRes.json()).data || []);
        setYears((await yearsRes.json()).data || []);
        setColors((await colorsRes.json()).data || []);
        setExamples((await examplesRes.json()).data || []);

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

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setCarData({
      plate: "",
      chassis: "",
      motor: "",
      file_car: "",
      brand_id: "",
      type_car_id: "",
      group_id: "",
      year_id: "",
      color_id: "",
      example_id: "",
      number_soat: "",
      date_soat_issue: "",
      date_soat_expiration: "",
    });
    setErrors({});
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores previos
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/registerCar`, {
        method: "POST",
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
      console.log(data, message, errors);
      if (data) {
        toast.success(message);
        resetForm();
        onClose(); // Cierra el modal
      } else {
        console.log(errors);
        setErrors(errors);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al registrar el vehículo.");
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

      <h2 className="text-2xl font-bold mb-4">Registrar Vehículo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos de texto */}
          {["plate", "chassis", "motor", "number_soat"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-semibold">
                {field === "plate"
                  ? "Placa"
                  : field === "chassis"
                  ? "Chasis"
                  : field === "motor"
                  ? "Motor"
                  : "Número de SOAT"}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={carData[field]}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded ${
                  errors[field] ? "border-red-500" : ""
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}

          {/* Campos select */}
          {[ 
            { name: "brand_id", options: brands, label: "Marca" },
            { name: "type_car_id", options: types, label: "Tipo de Vehículo" },
            { name: "group_id", options: groups, label: "Grupo" },
            { name: "year_id", options: years, label: "Año" },
            { name: "color_id", options: colors, label: "Color" },
            { name: "example_id", options: examples, label: "Modelo" },
          ].map(({ name, options, label }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-semibold">
                {label}
              </label>
              <select
                id={name}
                name={name}
                value={carData[name]}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded ${
                  errors[name] ? "border-red-500" : ""
                }`}
              >
                <option value="">Seleccione una opción</option>
                {options.length === 0 ? (
                  <option value="">No hay datos disponibles</option>
                ) : (
                  options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))
                )}
              </select>
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Campos de fecha */}
        <div>
          <label htmlFor="date_soat_issue" className="block text-sm font-semibold">
            Fecha de Emisión del SOAT
          </label>
          <input
            type="date"
            id="date_soat_issue"
            name="date_soat_issue"
            value={carData.date_soat_issue}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.date_soat_issue ? "border-red-500" : ""
            }`}
          />
          {errors.date_soat_issue && (
            <p className="text-red-500 text-sm">{errors.date_soat_issue}</p>
          )}
        </div>

        <div>
          <label htmlFor="date_soat_expiration" className="block text-sm font-semibold">
            Fecha de Vencimiento del SOAT
          </label>
          <input
            type="date"
            id="date_soat_expiration"
            name="date_soat_expiration"
            value={carData.date_soat_expiration}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.date_soat_expiration ? "border-red-500" : ""
            }`}
          />
          {errors.date_soat_expiration && (
            <p className="text-red-500 text-sm">{errors.date_soat_expiration}</p>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white py-2 px-6 rounded"
          >
            Limpiar Campos
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaSave /> Guardar Vehículo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
