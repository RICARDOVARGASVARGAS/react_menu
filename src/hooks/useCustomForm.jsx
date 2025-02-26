// useForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCustomForm = (schema, initialState = {}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema), // Usa el esquema de validación proporcionado
    defaultValues: initialState, // Usa los valores iniciales proporcionados
  });

  return {
    register,
    handleSubmit,
    errors,
    setError,
    reset,
    watch,
  };
};
