import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading"; // Indicador de carga
import { FaSave, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut } from "../../../services/apiService";
import { useForm } from "react-hook-form";

const EditBrand = ({ onClose, itemId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  // Cargar los datos a editar
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await apiGet(`getBrand/${itemId}`);
      const { data, message } = response;
      if (data) {
        reset(data);
      } else {
        toast.error(message || "No se pudieron cargar los datos.");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [itemId]);

  // Manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const response = await apiPut(`updateBrand/${itemId}`, data);
      const { data: updatedData, message } = response;

      if (updatedData) {
        toast.success(message || "Marca actualizada.");
        onClose();
      } else {
        toast.error(message || "No se pudo actualizar la Marca.");
      }
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
      toast.error(error.message || "Error al actualizar la marca.");
    } finally {
      setIsLoading(false);
    }
  });

  const handleDelete = async () => {
    // try {
    //   setLoading(true);
    //   const response = await fetch(`${API_BASE_URL}/deleteBrand/${itemId}`, {
    //     method: "DELETE",
    //   });
    //   const { data, message, error } = await response.json();
    //   if (error) {
    //     toast.error(message || "Error al eliminar el Marca.");
    //     return;
    //   }
    //   toast.success(message || "Marca eliminado.");
    //   onClose();
    // } catch (error) {
    //   console.error("Error al eliminar el Marca:", error);
    //   toast.error("No se pudo eliminar el Marca.");
    // } finally {
    //   setLoading(false);
    // }
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

      <h2 className="text-2xl font-bold mb-4">Editar Marca</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold">Nombre</label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              className={`mt-1 p-2 w-full border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name", {
                required: {
                  value: true,
                  message: "El Nombre es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El Nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El Nombre no debe exceder los 50 caracteres",
                },
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
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
        {/* {JSON.stringify(watch(), null, 2)} */}
      </form>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar este Marca?
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

export default EditBrand;
