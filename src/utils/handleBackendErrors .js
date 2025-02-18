import { useToastHook } from "../hooks/useToastHook";

export const handleBackendErrors = (error, setError) => {
  const { showToast } = useToastHook();
  const { message, errors: backendErrors } = error;
  // Mostrar mensaje general
  if (message) showToast(message, "error");

  // Mapear errores del backend al formulario
  if (backendErrors) {
    Object.entries(backendErrors).forEach(([field, messages]) => {
      setError(field, {
        type: "backend",
        message: messages[0], // Usar el primer mensaje del backend
      });
    });
  }
};
