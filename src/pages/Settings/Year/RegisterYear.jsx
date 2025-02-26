import React, { useState } from "react";
import Loading from "../../../components/Loading";
import { FaEraser, FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiPost } from "../../../services/apiService";
import { handleBackendErrors } from "../../../utils/handleBackendErrors ";
import { useToastHook } from "../../../hooks/useToastHook";
import { useCustomForm } from "../../../hooks/useCustomForm";
import { yearSchema } from "../../../validations";
import { Button, Error, Input, Label } from "../../../components/ui";

const RegisterYear = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();
  const { register, handleSubmit, errors, reset, setError } = useCustomForm(
    yearSchema,
    {
      name: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const response = await apiPost("registerYear", formData);
      const { data, message } = response;

      if (data) {
        onClose();
        showToast(message, "success");
      } else {
        showToast(message, "error");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
      {isLoading && <Loading />}

      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <AiOutlineClose size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Registrar Año</h2>

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
          <Button
            color="gray"
            type="button"
            onClick={() => reset()}
            disabled={isLoading}
          >
            <FaEraser /> Limpiar
          </Button>
          <Button color="blue" type="submit" disabled={isLoading}>
            <FaSave /> Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterYear;
