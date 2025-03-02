import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import {
  FaCheck,
  FaEraser,
  FaList,
  FaSave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut, apiFetch, apiDelete } from "../../services/apiService";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { API_DATA_PEOPLE_URL } from "../../config/enviroments";
import DeleteModal from "../../components/elements/DeleteModal";
import { useToastHook } from "../../hooks/useToastHook";
import { userSchema } from "../../validations/userSchema";
import { useCustomForm } from "../../hooks/useCustomForm";
import { Button, Error, Input, Label } from "../../components/ui";

const EditUser = ({ onClose, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToastHook();
  const { register, handleSubmit, errors, reset, setError, watch } =
    useCustomForm(userSchema, {});

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const documentNumber = watch("document");

    // Validación del número de documento
    if (!documentNumber || documentNumber.length !== 8) {
      showToast("Por favor, ingrese el número de documento.", "error");
      return;
    }

    setIsSearching(true);

    try {
      const { status, message, information } = await apiFetch(
        `${API_DATA_PEOPLE_URL}/${documentNumber}`
      );

      if (!status) {
        showToast(message, "error");
        reset({
          name: "",
          first_name: "",
          last_name: "",
        });
      } else {
        reset({
          name: information.names,
          first_name: information.father_last_name,
          last_name: information.mother_last_name,
        });
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      showToast(error.message, "error");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Obtener los datos del conductor por ID
  const fetchData = async () => {
    setIsLoading(true);

    const { data, message, success } = await apiGet(`user/getUser/${userId}`);

    if (success) {
      // console.log(data);
      reset(data);
    } else {
      showToast(message, "error");
    }

    setIsLoading(false);
  };

  // Enviar los datos actualizados del conductor
  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const { data, message, success } = await apiPut(
        `user/updateUser/${userId}`,
        formData
      );

      if (success) {
        reset(data);
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

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await apiDelete(`user/deleteUser/${userId}`);
      const { data, message, success } = response;
      if (success) {
        showToast(message, "success");
        onClose();
      } else {
        showToast("No se pudo eliminar el Usuario.", "error");
      }
    } catch (error) {
      console.log(error);
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
        {isLoading && <Loading />}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Actualizar Usuario</h2>

        <form
          onSubmit={onSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-4 mx-auto w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block mb-2 text-gray-700 font-medium">
                Estado
              </label>
              <select
                name="is_active"
                className={`border ${
                  errors.is_active ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2 w-full`}
                {...register("is_active", {
                  required: {
                    value: true,
                    message: "El estado es requerido",
                  },
                })}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
              {errors.is_active && (
                <Error message={errors.is_active?.message} />
              )}
            </div>
            <div>
              <Label> N° Documento</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  name="document"
                  autoComplete="off"
                  hasError={!!errors.document}
                  {...register("document")}
                />
                {errors.document && (
                  <Error message={errors.document?.message} />
                )}
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  color="green"
                >
                  <FaSearch /> Buscar
                </Button>
              </div>
            </div>
            <div>
              <Label>Nombres</Label>
              <Input
                type="text"
                name="name"
                autoComplete="off"
                hasError={!!errors.name}
                {...register("name")}
              />
              {errors.name && <Error message={errors.name?.message} />}
            </div>

            <div>
              <Label>Apellido Paterno</Label>
              <Input
                type="text"
                name="first_name"
                autoComplete="off"
                hasError={!!errors.first_name}
                {...register("first_name")}
              />
              {errors.first_name && (
                <Error message={errors.first_name?.message} />
              )}
            </div>

            <div>
              <Label>Apellido Materno</Label>
              <Input
                type="text"
                name="last_name"
                autoComplete="off"
                hasError={!!errors.last_name}
                {...register("last_name")}
              />
              {errors.last_name && (
                <Error message={errors.last_name?.message} />
              )}
            </div>

            <div>
              <Label>Correo Electrónico</Label>
              <Input
                type="email"
                name="email"
                autoComplete="off"
                hasError={!!errors.email}
                {...register("email")}
              />
              {errors.email && <Error message={errors.email?.message} />}
            </div>

            <div>
              <Label> Teléfono (Opcional)</Label>
              <Input
                type="text"
                name="phone_number"
                autoComplete="off"
                hasError={!!errors.phone_number}
                {...register("phone_number")}
              />
              {errors.phone_number && (
                <Error message={errors.phone_number?.message} />
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <Button color="blue" type="submit" disabled={isLoading}>
              <FaSave /> Actualizar
            </Button>
            <Button
              color="red"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
            >
              <FaEraser /> Eliminar
            </Button>
          </div>
        </form>
        {showDeleteModal && (
          <DeleteModal
            text="¿Estás seguro de que deseas eliminar este Usuario?"
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default EditUser;
