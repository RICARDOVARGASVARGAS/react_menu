export const handleBackendErrors = (error, setError, toast) => {
  const { message, errors: backendErrors } = error;

  // Mostrar mensaje general
  if (message) toast.error(message);

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
