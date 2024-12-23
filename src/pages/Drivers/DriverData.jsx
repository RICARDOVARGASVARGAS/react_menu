import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaEdit, FaUpload, FaTrashAlt } from "react-icons/fa";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../config/config/apiConfig";

const DriverData = ({ driverId }) => {
  const [formItem, setFormItem] = useState({
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
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/getDriver/${driverId}`);
      const { data } = await response.json();

      if (data) {
        const driver = data;
        setFormItem({
          document_type: driver.document_type,
          document_number: driver.document_number,
          name: driver.name,
          first_name: driver.first_name,
          last_name: driver.last_name,
          birth_date: driver.birth_date || "",
          email: driver.email || "",
          phone_number: driver.phone_number || "",
          address: driver.address || "",
          gender: driver.gender,
          image: driver.image || "",
        });
        // console.log(driver);
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
    setFormItem({ ...formItem, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Buscar información del conductor usando el número de documento
  const handleSearch = async () => {
    if (!formItem.document_number) {
      toast.error("Por favor, ingrese el número de documento.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://data-people.codepro-peru.com/api/getPerson/${formItem.document_number}`
      );
      const data = await response.json();

      if (data.status) {
        toast.success(data.message);

        setFormItem({
          ...formItem,
          name: data.information.names || "",
          first_name: data.information.father_last_name || "",
          last_name: data.information.mother_last_name || "",
          birth_date: data.information.birthday || "",
          gender: data.information.gender,
        });
      } else {
        toast.error(data.message);

        setFormItem({
          document_type: formItem.document_type,
          document_number: formItem.document_number,
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
      setIsLoading(false);
    }
  };

  // Enviar los datos actualizados del conductor
  const handleSubmit = async (e) => {
    // Evitar que el formulario recargue la página
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/updateDriver/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formItem),
      });

      const { data, message, errors } = await response.json();

      if (data) {
        toast.success(message);
      } else {
        setErrors(errors);
        toast.error(message);
      }
    } catch (error) {
      console.error("Error al actualizar el conductor:", error);
      toast.error("Ocurrió un error al actualizar el conductor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Subir la imagen del conductor
    if (formItem.image && imageStatus) {
      handleSubmit();
      setImageStatus(false);
    }
    // Eliminar la imagen del conductor
    if (!formItem.image && imageStatus) {
      handleSubmit();
      setImageStatus(false);
    }
  }, [formItem.image]);

  // Subir la imagen del conductor
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Por favor, seleccione una imagen.");
      return;
    }

    const formFile = new FormData();
    formFile.append("file", file);
    formFile.append("location", "drivers/".concat(driverId));

    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch(
        `http://storage_sync.test/api/files/upload`,
        {
          method: "POST",
          headers: {
            Authorization: "064b448c-059a-4c3b-8507-312bfa1219ad", // Agrega el token aquí
          },
          body: formFile,
        }
      );

      const { message, errors, file } = await response.json();

      if (file) {
        setImageStatus(true);
        const url = file.url;

        setFormItem({
          ...formItem,
          image: url,
        });
      } else {
        toast.error(message || "Ocurrió un error al subir la imagen.");
        setErrors(errors || {});
      }
    } catch (err) {
      toast.error("Ocurrió un error al subir la imagen.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar la imagen del conductor
  const handleDeleteImage = async () => {
    setIsLoading(true);
    // Verificar si el conductor tiene una imagen
    if (formItem.image) {
      const encodedUrl = btoa(formItem.image);
      const response = await fetch(
        `http://storage_sync.test/api/files/${encodedUrl}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "064b448c-059a-4c3b-8507-312bfa1219ad",
          },
          body: JSON.stringify({}),
        }
      );

      const { file, message, errors } = await response.json();
      if (file) {
        setImageStatus(true);
        // toast.success(message);
        setFormItem({
          ...formItem,
          image: "",
        });
      } else {
        toast.error(message);
      }

      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Editar Datos del Conductor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="col-span-1 flex flex-col items-center">
          <div className="relative">
            <img
              src={formItem.image || "/src/assets/no-image.png"}
              alt="Avatar"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border shadow"
            />
            {!formItem.image && (
              <label
                htmlFor="avatarInput"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 shadow-md"
              >
                {isLoading ? "Subiendo..." : <FaUpload />}
              </label>
            )}
            <input
              type="file"
              id="avatarInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>
          {formItem.image && (
            <button
              onClick={handleDeleteImage}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 shadow"
            >
              <FaTrashAlt />
              Eliminar Perfil
            </button>
          )}
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Tipo de Documento */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Tipo de Documento
            </label>
            <select
              name="document_type"
              value={formItem.document_type}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="dni">DNI</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>

          {/* Número de Documento */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Número de Documento
            </label>
            <div className="flex">
              <input
                type="text"
                name="document_number"
                value={formItem.document_number}
                onChange={handleChange}
                className="border border-gray-300 rounded-l px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none flex-grow"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 flex items-center justify-center"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Nombres */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Nombres
            </label>
            <input
              type="text"
              name="name"
              value={formItem.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Apellido Paterno */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Apellido Paterno
            </label>
            <input
              type="text"
              name="first_name"
              value={formItem.first_name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Apellido Materno */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Apellido Materno
            </label>
            <input
              type="text"
              name="last_name"
              value={formItem.last_name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birth_date"
              value={formItem.birth_date}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Correo Electrónico */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formItem.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Número de Teléfono */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Número de Teléfono
            </label>
            <input
              type="text"
              name="phone_number"
              value={formItem.phone_number}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Dirección */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              value={formItem.address}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Género */}
          <div className="flex flex-col">
            <label className="block mb-1 text-gray-700 font-medium">
              Género
            </label>
            <select
              name="gender"
              value={formItem.gender}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
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

export default DriverData;
