import { useState } from "react";
import { apiPost } from "../services/apiService";
import { useToastHook } from "./useToastHook";

export const useFileUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();
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
      showToast("Por favor, seleccione un archivo.", "info");
      setIsLoading(false);
      return;
    }

    // Validar tamaño del archivo (máximo 5 MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("El archivo excede el tamaño máximo de 5 MB.", "error");
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
        showToast(message, "success");
        if (onSuccess) onSuccess({ item, url });
      } else {
        showToast(message, "error");
        if (onError) onError(message);
      }
    } catch (error) {
      showToast(error.message, "error");
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
        showToast(message, "success");
        if (onSuccess) onSuccess({});
      } else {
        showToast(message, "error");
        if (onError) onError(message);
      }
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteFile, isLoading };
};
