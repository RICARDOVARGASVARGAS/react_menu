import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import { FaSave, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut, apiDelete } from "../../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../../utils/handleBackendErrors ";
import DeleteModal from "../../../components/elements/DeleteModal";
import ProtectedComponent from "../../../components/ProtectedComponent";

const EditGroup = ({ onClose, itemId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
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

      const response = await apiGet(`getGroup/${itemId}`);
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
      const response = await apiPut(`updateGroup/${itemId}`, data);
      const { data: updatedData, message } = response;

      if (updatedData) {
        toast.success(message || "Asociación actualizada.");
        onClose();
      } else {
        toast.error(message || "No se pudo actualizar la Asociación.");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await apiDelete(`deleteGroup/${itemId}`);
      const { data, message } = response;
      if (data) {
        toast.success(message || "Asociación eliminada.");
        onClose();
      } else {
        toast.error(message || "No se pudo eliminar la Asociación.");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
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

      <h2 className="text-2xl font-bold mb-4">Editar Asociación</h2>

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
          <ProtectedComponent requiredPermissions={"group.destroy"}>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded flex items-center gap-2"
            >
              <FaTrash />
              Eliminar
            </button>
          </ProtectedComponent>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded flex items-center gap-2"
          >
            <FaSave /> Actualizar
          </button>
        </div>
      </form>
      {showDeleteModal && (
        <DeleteModal
          text="¿Estás seguro de que deseas eliminar esta Asociación?"
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EditGroup;
