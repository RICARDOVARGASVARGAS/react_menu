import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading"; // Indicador de carga
import { FaSave, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import API_BASE_URL from "../../../config/config/apiConfig";

/**
 * Componente para editar un Color
 * @param {Function} onClose - Función para cerrar el modal
 * @param {number} itemId - ID del Item a editar
 */
const EditColor = ({ onClose, itemId }) => {
  const navigate = useNavigate();

  // Estado para la carga del formulario
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estado para los datos del formulario
  const [itemData, setItemData] = useState({
    name: "",
    hex: "#000000",
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Cargar los datos a editar
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setIsLoadingData(true);

        const response = await fetch(`${API_BASE_URL}/getColor/${itemId}`);
        const { data, message } = await response.json();

        if (data) {
          setItemData({
            name: data.name || "",
            hex: data.hex || "#000000",
          });
        } else {
          toast.error(message || "No se pudieron cargar los datos.");
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCarData();
  }, [itemId]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({
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

      const response = await fetch(`${API_BASE_URL}/updateColor/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...itemData,
        }),
      });

      const { data, message, errors } = await response.json();
      if (data) {
        toast.success(message);
        onClose(); // Cierra el modal
      } else {
        setErrors(errors);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar el Color.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/deleteColor/${itemId}`, {
        method: "DELETE",
      });

      const { data, message, error } = await response.json();
      if (error) {
        toast.error(message || "Error al eliminar el Color.");
        return;
      }
      toast.success(message || "Color eliminado.");
      onClose();
    } catch (error) {
      console.error("Error al eliminar el Color:", error);
      toast.error("No se pudo eliminar el Color.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || isLoadingData) return <Loading />;

  return (
    <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <AiOutlineClose size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Editar Color</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <label className="block text-sm font-semibold">Color</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              value={itemData.name || ""}
              onChange={handleChange}
              className={`mt-1 p-2 w-full border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold">HEX {itemData.hex}</label>
            <input
              type="color"
              id="hex"
              name="hex"
              autoComplete="off"
              value={itemData.hex}
              onChange={handleChange}
              className={`mt-1 p-1 h-10 w-full border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.hex && (
              <p className="text-red-500 text-sm">{errors.hex}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
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
              ¿Estás seguro de que deseas eliminar este Color?
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

export default EditColor;
