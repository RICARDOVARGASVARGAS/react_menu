import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // Indicador de carga
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const EditCar = ({ onClose, vehicleId, driverId }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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

  const [errors, setErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [years, setYears] = useState([]);
  const [colors, setColors] = useState([]);
  const [examples, setExamples] = useState([]);

  // Cargar las opciones para los selects
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer tu_token_aqui",
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
            "http://secov_back.test/api/getBrands?page=1&perPage=all&sort=asc",
            { headers }
          ),
          fetch(
            "http://secov_back.test/api/getTypeCars?page=1&perPage=all&sort=asc",
            { headers }
          ),
          fetch(
            "http://secov_back.test/api/getGroups?page=1&perPage=all&sort=asc",
            { headers }
          ),
          fetch(
            "http://secov_back.test/api/getYears?page=1&perPage=all&sort=asc",
            { headers }
          ),
          fetch(
            "http://secov_back.test/api/getColors?page=1&perPage=all&sort=asc",
            { headers }
          ),
          fetch(
            "http://secov_back.test/api/getExamples?page=1&perPage=all&sort=asc",
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

  // Cargar los datos del vehículo para editar
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://secov_back.test/api/getCarById/${vehicleId}`
        );
        const { data } = await response.json();
        if (data) {
          setCarData(data);
        } else {
          toast.error("No se pudo cargar el vehículo.");
        }
      } catch (error) {
        console.error("Error al cargar el vehículo:", error);
        toast.error("Error al cargar el vehículo.");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

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
    setErrors({}); // Limpiar errores previos
    try {
      setLoading(true);
      const response = await fetch(
        `http://secov_back.test/api/updateCar/${vehicleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...carData,
            driver_id: driverId,
          }),
        }
      );

      const { data, message, errors } = await response.json();
      if (data) {
        toast.success(message);
        onClose(); // Cierra el modal
      } else {
        setErrors(errors);
        toast.error(message);
      }
    } catch (error) {
      toast.error("Error al actualizar el vehículo.");
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
            { name: "example_id", options: examples, label: "Ejemplo" },
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

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <FaSave className="mr-2" /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
