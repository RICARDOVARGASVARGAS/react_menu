import { useState } from "react";
import { toast } from "react-toastify";
import { apiPost } from "../services/apiService";

export const useFileUploader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async ({
    model,
    id,
    file,
    folder,
    field,
    onSuccess,
    onError,
  }) => {
    setIsLoading(true);

    if (!file) {
      toast.error("Por favor, seleccione un archivo.");
      setIsLoading(false);
      return;
    }

    // Validar tamaño del archivo (máximo 5 MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("El archivo excede el tamaño máximo de 5 MB.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("model", model);
    formData.append("id", id);
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("field", field);

    try {
      const response = await apiPost("file/upload", formData, true); // `true` indica que es multipart
      const { item, success, message, url } = response;

      if (success) {
        toast.success(message, { autoClose: 1000, position: "top-center" });
        if (onSuccess) onSuccess({ item, url });
      } else {
        toast.error(message);
        if (onError) onError(message);
      }
    } catch (error) {
      toast.error(error.message);
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading };
};

export const useFileDelete = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteFile = async ({ model, id, field, onSuccess, onError }) => {
    setIsLoading(true);

    try {
      const data = await apiPost(`file/delete`, {
        model,
        id,
        field,
      });

      const { item, success, message } = data;

      if (success) {
        toast.success(message, { autoClose: 1000, position: "top-center" });
        if (onSuccess) onSuccess({});
      } else {
        toast.error(message);
        if (onError) onError(message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteFile, isLoading };
};
