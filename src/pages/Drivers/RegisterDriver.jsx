import React, { useState } from "react";
import Loading from "../../components/Loading";
import {
  FaCheck,
  FaList,
  FaSearch,
  FaEraser,
  FaSave,
  FaTable,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiFetch, apiPost } from "../../services/apiService";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { API_DATA_PEOPLE_URL } from "../../config/enviroments";
import { useToastHook } from "../../hooks/useToastHook";
import { useCustomForm } from "../../hooks/useCustomForm";
import { Button, Error, Input, Label } from "../../components/ui";
import { driverSchemaRegister } from "../../validations/driverSchema";

const RegisterDriver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();
  const { register, handleSubmit, errors, reset, setError, watch } =
    useCustomForm(driverSchemaRegister, {
      document_type: "dni",
      document_number: "",
      name: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      email: null, // Inicializado como null
      phone_number: null, // Inicializado como null
      address: null, // Inicializado como null
      gender: "M",
    });

  const navigate = useNavigate();

  const handleSearch = async () => {
    const documentNumber = watch("document_number");

    // Validación del número de documento
    if (!documentNumber || documentNumber.length !== 8) {
      showToast("Por favor, ingrese el número de documento.");
      return;
    }

    setIsLoading(true);

    try {
      const { status, message, information } = await apiFetch(
        `${API_DATA_PEOPLE_URL}/${documentNumber}`
      );

      if (!status) {
        showToast(message, "error");
        reset({
          document_type: "dni",
          document_number: "",
          name: "",
          first_name: "",
          last_name: "",
          birth_date: "",
          email: null, // Inicializado como null
          phone_number: null, // Inicializado como null
          address: null, // Inicializado como null
          gender: "M",
        });
      } else {
        reset({
          name: information.names,
          first_name: information.father_last_name,
          last_name: information.mother_last_name,
          birth_date: information.birthday,
        });
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      showToast("Hubo un problema al buscar el conductor.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const response = await apiPost("registerDriver", formData);
      const { data, message } = response;

      if (data) {
        showToast(message || "Conductor registrado.", "success");
        navigate("/driver-data/" + data.id);
      } else {
        showToast(message || "No se pudo registrar el conductor.", "error");
      }
    } catch (error) {
      handleBackendErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex-1 overflow-auto">
        <main className="p-1">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Registrar un Nuevo Conductor
          </h1>
          <form
            onSubmit={onSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-4 mx-auto w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label> Tipo de Documento </Label>
                <select
                  name="document_type"
                  className={`border ${
                    errors.document_type ? "border-red-500" : "border-gray-300"
                  } rounded px-4 py-2 w-full`}
                  {...register("document_type", {
                    required: {
                      value: true,
                      message: "El Tipo de Documento es requerido",
                    },
                  })}
                >
                  <option value="dni">DNI</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
                {errors.document_type && (
                  <Error message={errors.document_type?.message} />
                )}
              </div>

              <div>
                <Label> N° Documento</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    name="document_number"
                    autoComplete="off"
                    hasError={!!errors.document_number}
                    {...register("document_number")}
                  />

                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={isLoading}
                    color="green"
                  >
                    <FaSearch /> Buscar
                  </Button>
                </div>
                {errors.document_number && (
                  <Error message={errors.document_number?.message} />
                )}
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
                <Label>Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  name="birth_date"
                  autoComplete="off"
                  hasError={!!errors.birth_date}
                  {...register("birth_date")}
                />
                {errors.birth_date && (
                  <Error message={errors.birth_date?.message} />
                )}
              </div>

              <div>
                <Label>Genero</Label>
                <select
                  name="gender"
                  className={`border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded px-4 py-2 w-full`}
                  {...register("gender", {
                    required: {
                      value: true,
                      message: "El Genero es requerido",
                    },
                  })}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                {errors.gender && <Error message={errors.gender?.message} />}
              </div>

              <div>
                <Label> Correo Electrónico (Opcional)</Label>
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

              <div>
                <Label> Dirección (Opcional)</Label>
                <Input
                  type="text"
                  name="address"
                  autoComplete="off"
                  hasError={!!errors.address}
                  {...register("address")}
                />
                {errors.address && <Error message={errors.address?.message} />}
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-6 overflow-x-auto">
              <Button color="blue" type="submit" disabled={isLoading}>
                <FaSave /> Guardar
              </Button>
              <Button
                color="green"
                type="button"
                onClick={() => navigate("/list-drivers")}
                disabled={isLoading}
              >
                <FaTable /> Lista
              </Button>
              <Button
                color="gray"
                type="button"
                onClick={() => reset()}
                disabled={isLoading}
              >
                <FaEraser /> Limpiar
              </Button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default RegisterDriver;
