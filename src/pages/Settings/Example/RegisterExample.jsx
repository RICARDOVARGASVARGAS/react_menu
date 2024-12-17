import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading"; // Indicador de carga
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import API_BASE_URL from "../../../config/config/apiConfig";

/**
 * Componente para agregar un nuevo vehículo
 * @param {Function} onClose - Función para cerrar el modal
 */
const RegisterExample = ({ onClose }) => {
  const navigate = useNavigate();

  // Estado para la carga del formulario
  const [loading, setLoading] = useState(false);

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Estado para los datos del formulario
  const [itemData, setItemData] = useState({
    name: "",
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setItemData({
      name: "",
    });
    setErrors({});
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores previos
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/registerExample`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...itemData,
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={itemData.name || ""}
              autoComplete="off"
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white py-2 px-6 rounded"
          >
            Limpiar
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

export default RegisterExample;
