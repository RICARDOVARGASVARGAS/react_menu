import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import API_BASE_URL from "../../config/config/apiConfig";

const RegisterLicense = ({ onClose, driverId }) => {
  const navigate = useNavigate();

  // Estado para la carga del formulario
  const [loading, setLoading] = useState(false);

  // Estado para los datos del formulario
  const [license, setLicense] = useState({
    number: "",
    renewal_date: "",
    issue_date: "",
    class: "",
    category: "",
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicense((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores previos
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/registerDriverLicense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...license,
          driver_id: driverId,
        }),
      });

      const { data, message, errors } = await response.json();
    //   console.log(data, message, errors);
      if (data) {
        toast.success(message);
        onClose();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold">N° Licencia</label>
            <input
              type="text"
              id="number"
              name="number"
              value={license.number || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.number ? "border-red-500" : ""
              }`}
            />
            {errors.number && (
              <p className="text-red-500 text-sm">{errors.number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Clase</label>
            <input
              type="text"
              id="class"
              name="class"
              value={license.class || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.class ? "border-red-500" : ""
              }`}
            />
            {errors.class && (
              <p className="text-red-500 text-sm">{errors.class}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">Categoría</label>
            <input
              type="text"
              id="category"
              name="category"
              value={license.category || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.category ? "border-red-500" : ""
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">F. Inicio</label>
            <input
              type="date"
              id="issue_date"
              name="issue_date"
              value={license.issue_date || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.issue_date ? "border-red-500" : ""
              }`}
            />
            {errors.issue_date && (
              <p className="text-red-500 text-sm">{errors.issue_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              F. Revalidación
            </label>
            <input
              type="date"
              id="renewal_date"
              name="renewal_date"
              value={license.renewal_date || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.renewal_date ? "border-red-500" : ""
              }`}
            />
            {errors.renewal_date && (
              <p className="text-red-500 text-sm">{errors.renewal_date}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-6 rounded"
          >
            Cerrar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaSave /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterLicense;
