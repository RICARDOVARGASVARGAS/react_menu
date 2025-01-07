import { useState } from "react";
import { toast } from "react-toastify";
import { apiPost, uploadFileStorage } from "../services/apiService";
import { TOKEN_API_STORAGE } from "../config/enviroments";

export const useFileUploader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async ({
    file,
    model,
    modelId,
    modelStorage,
    storagePath,
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

    try {
      const { message, item } = await uploadFileStorage(
        file,
        model,
        modelId,
        modelStorage,
        storagePath
      );

      if (item) {
        // toast.success(message);
        if (onSuccess) onSuccess(item);
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

  return { uploadFile, isLoading };
};

export const useFileDelete = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteFile = async ({
    model,
    modelId,
    modelStorage,
    encode_url,
    onSuccess,
    onError,
  }) => {
    setIsLoading(true);

    try {
      const data = await apiPost(`deleteFile`, {
        model: model,
        model_id: modelId,
        model_storage: modelStorage,
        api_key: TOKEN_API_STORAGE,
        encode_url_file: encode_url,
      });

      console.log(data);

      if (item) {
        // toast.success(message);
        if (onSuccess) onSuccess({ file, item, message });
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
