import React, { useState, useEffect } from "react";
import Loading from "../../../components/Loading";
import { FaSave, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut, apiDelete } from "../../../services/apiService";
import { handleBackendErrors } from "../../../utils/handleBackendErrors ";
import DeleteModal from "../../../components/elements/DeleteModal";
import ProtectedComponent from "../../../components/ProtectedComponent";
import { useToastHook } from "../../../hooks/useToastHook";
import { useCustomForm } from "../../../hooks/useCustomForm";
import { exampleSchema } from "../../../validations";
import { Button, Error, Input, Label } from "../../../components/ui";

const EditExample = ({ onClose, itemId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToastHook();
  const { register, handleSubmit, errors, reset, setError } = useCustomForm(
    exampleSchema,
    {}
  );

  // Cargar los datos a editar
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await apiGet(`getExample/${itemId}`);
      const { data, message } = response;
      if (data) {
        reset(data);
      } else {
        showToast(message, "error");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [itemId]);

  // Manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const response = await apiPut(`updateExample/${itemId}`, data);
      const { data: updatedData, message } = response;

      if (updatedData) {
        showToast(message, "success");
        onClose();
      } else {
        showToast(message, "error");
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
      const response = await apiDelete(`deleteExample/${itemId}`);
      const { data, message } = response;
      if (data) {
        showToast(message || "Modelo eliminado.", "success");
        onClose();
      } else {
        showToast(message || "No se pudo eliminar la Modelo.", "error");
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

      <h2 className="text-2xl font-bold mb-4">Editar Modelo</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <Label>Nombre</Label>
            <Input
              type="text"
              name="name"
              autoComplete="off"
              hasError={!!errors.name}
              {...register("name")}
            />
            {errors.name && <Error message={errors.name?.message} />}
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <ProtectedComponent requiredPermissions={"example.destroy"}>
            <Button
              color="red"
              type="button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash />
              Eliminar
            </Button>
          </ProtectedComponent>
          <Button color="blue" type="submit">
            <FaSave /> Actualizar
          </Button>
        </div>
      </form>
      {showDeleteModal && (
        <DeleteModal
          text="¿Estás seguro de que deseas eliminar esta Modelo?"
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EditExample;
