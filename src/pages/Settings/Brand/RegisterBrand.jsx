import React, { useState } from "react";
import Loading from "../../../components/Loading";
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiPost } from "../../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../../utils/handleBackendErrors ";
import { useToastHook } from "../../../hooks/useToastHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema } from "../../../validations";
import Error from "../../../components/ui/Error";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";

const RegisterBrand = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(brandSchema), // Envuelve brandSchema con zodResolver
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const response = await apiPost("registerBrand", formData);
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

      <h2 className="text-2xl font-bold mb-4">Registrar Marca</h2>

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
          <button
            type="button"
            onClick={() => reset()}
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

        {/* {JSON.stringify(watch(), null, 2)} */}
      </form>
    </div>
  );
};

export default RegisterBrand;
