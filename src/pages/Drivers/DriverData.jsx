import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverData = ({ driverId }) => {
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      const response = await fetch(
        `http://secov_back.test/api/getDriver/${driverId}`
      );
      const data = await response.json();

      if (data.data) {
        const driver = data.data;
        setFormData({
          document_type: driver.document_type,
          document_number: driver.document_number,
          name: driver.name,
          first_name: driver.first_name,
          last_name: driver.last_name,
          birth_date: driver.birth_date,
          email: driver.email,
          phone_number: driver.phone_number,
          address: driver.address,
          gender: driver.gender,
        });
      } else {
        toast.error("Conductor no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del conductor:", error);
      toast.error("Ocurrió un error al obtener los datos del conductor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Buscar información del conductor usando el número de documento
  const handleSearch = async () => {
    if (!formData.document_number) {
      toast.error("Por favor, ingrese el número de documento.");
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://data-people.codepro-peru.com/api/getPerson/${formData.document_number}`
      );
      const data = await response.json();

      if (data.status) {
        toast.success(data.message);

        setFormData({
          ...formData,
          name: data.information.names || "",
          first_name: data.information.father_last_name || "",
          last_name: data.information.mother_last_name || "",
          birth_date: data.information.birthday || "",
          gender: data.information.gender,
        });
      } else {
        toast.error(data.message);

        setFormData({
          document_type: formData.document_type,
          document_number: formData.document_number,
          name: "",
          first_name: "",
          last_name: "",
          birth_date: "",
          email: "",
          phone_number: "",
          address: "",
          gender: "M",
        });
      }
    } catch (error) {
      console.error("Error al buscar la persona:", error);
      toast.error("Ocurrió un error al realizar la búsqueda.");
    } finally {
      setIsSearching(false);
    }
  };

  // Enviar los datos actualizados del conductor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://secov_back.test/api/updateDriver/${driverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const { data, message, errors } = await response.json();

      if (data) {
        toast.success(message);
      } else {
        setErrors(errors);
        console.log(errors);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      console.error("Error al actualizar el conductor:", error);
      toast.error("Ocurrió un error al actualizar el conductor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg p-6 space-y-4 mx-auto w-full"
      onSubmit={handleSubmit}
    >
      {isLoading && <Loading />}

      <div>
        <label className="block mb-2 text-gray-700 font-medium">
          Tipo de Documento
        </label>
        <select
          name="document_type"
          value={formData.document_type}
          onChange={handleChange}
          className={`border ${
            errors.document_type ? "border-red-500" : "border-gray-300"
          } rounded px-4 py-2 w-full`}
        >
          <option value="dni">DNI</option>
          <option value="passport">Pasaporte</option>
        </select>
        {errors.document_type && (
          <p className="text-red-500 text-sm mt-1">{errors.document_type[0]}</p>
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
            value={formData.document_number}
            onChange={handleChange}
            className={`border ${
              errors.document_number ? "border-red-500" : "border-gray-300"
            } rounded px-4 py-2 w-full`}
            placeholder="Ingrese el número de documento"
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
          <p className="text-red-500 text-sm mt-1">
            {errors.document_number[0]}
          </p>
        )}
      </div>

      {[
        { name: "name", label: "Nombres" },
        { name: "first_name", label: "Apellido Paterno" },
        { name: "last_name", label: "Apellido Materno" },
        { name: "birth_date", label: "Fecha de Nacimiento" },
        { name: "email", label: "Correo Electrónico" },
        { name: "phone_number", label: "Número de Teléfono" },
        { name: "address", label: "Dirección" },
      ].map(({ name, label }) => (
        <div key={name}>
          <label className="block mb-2 text-gray-700 font-medium">
            {label}
          </label>
          <input
            type={name === "birth_date" ? "date" : "text"}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`border ${
              errors[name] ? "border-red-500" : "border-gray-300"
            } rounded px-4 py-2 w-full`}
            placeholder={`Ingrese ${label.toLowerCase()}`}
          />
          {errors[name] && (
            <p className="text-red-500 text-sm mt-1">{errors[name][0]}</p>
          )}
        </div>
      ))}

      <div>
        <label className="block mb-2 text-gray-700 font-medium">Género</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={`border ${
            errors.gender ? "border-red-500" : "border-gray-300"
          } rounded px-4 py-2 w-full`}
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        disabled={isLoading}
      >
        {isLoading ? <Loading size="small" /> : "Actualizar Conductor"}
      </button>
    </form>
  );
};

export default DriverData;
