import { useState } from "react";
import { toast } from "react-toastify";
import { apiPost } from "../services/apiService";
import { TOKEN_API_STORAGE } from "../config/enviroments";

export const useFileUploader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async ({
    file,
    model,
    model_id,
    model_storage,
    storage,
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
    formData.append("file", file);
    formData.append("model", model);
    formData.append("model_id", model_id);
    formData.append("model_storage", model_storage);
    formData.append("storage", storage);
    formData.append("token", TOKEN_API_STORAGE);

    try {
      const response = await apiPost("uploadFile", formData, true); // `true` indica que es multipart
      const { file, message } = response;

      if (file) {
        toast.success(message);
        if (onSuccess) onSuccess({ file, message });
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

  const deleteFile = async ({
    model,
    model_id,
    model_storage,
    uuid,
    onSuccess,
    onError,
  }) => {
    setIsLoading(true);

    try {
      const data = await apiPost(`deleteFile`, {
        model,
        model_id,
        model_storage,
        token: TOKEN_API_STORAGE,
        uuid,
      });

      const { file, message } = data;

      if (file) {
        // toast.success(message);
        if (onSuccess) onSuccess({ file, message });
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
