import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { FaCheck, FaSave, FaSearch, FaTrash } from "react-icons/fa";
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Íconos para mostrar/ocultar
import { apiGet, apiPut, apiFetch, apiDelete } from "../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useToastHook } from "../../hooks/useToastHook";
import { useAuth } from "../../hooks/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const { id, document, name, first_name, last_name, email, phone_number } = user;
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();

  // Estados para mostrar/ocultar contraseñas
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      password_confirmation: "",
    },
  });

  const newPassword = watch("new_password"); // Observa el campo "new_password"

  const changePassword = handleSubmit(async (form) => {
    if (form.new_password !== form.password_confirmation) {
      setError("password_confirmation", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiPut(`user/changePasswordUser/${id}`, form);
      const { success, message } = response;
      if (success) {
        showToast(message, "success");
        reset();
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
    <div>
      <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
        {isLoading && <Loading />}
        <h2 className="text-2xl font-bold mb-4 text-center">MI PERFIL</h2>
        <div className="bg-white rounded-lg p-2 md:p-6 space-y-4 mx-auto w-full">
          {/* Datos del perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">N° Documento</label>
              <input
                type="text"
                name="document"
                autoComplete="off"
                className="mt-1 p-2 w-full border rounded"
                value={document}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Nombres</label>
              <input
                type="text"
                name="name"
                autoComplete="off"
                className="mt-1 p-2 w-full border rounded"
                value={name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Apellidos</label>
              <input
                type="text"
                name="last_name"
                autoComplete="off"
                className="mt-1 p-2 w-full border rounded"
                value={first_name + " " + last_name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Correo Electrónico</label>
              <input
                type="text"
                name="email"
                autoComplete="off"
                className="mt-1 p-2 w-full border rounded"
                value={email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">N° Telefono</label>
              <input
                type="text"
                name="phone_number"
                autoComplete="off"
                className="mt-1 p-2 w-full border rounded"
                value={phone_number}
                readOnly
              />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">CAMBIAR CONTRASEÑA</h2>
        <form onSubmit={changePassword} className="space-y-4 p-2 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Contraseña Actual */}
            <div>
              <label className="block text-sm font-semibold">Contraseña Actual</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"} // Alterna entre "text" y "password"
                  name="old_password"
                  autoComplete="off"
                  className={`mt-1 p-2 w-full border rounded ${
                    errors.old_password ? "border-red-500" : ""
                  }`}
                  {...register("old_password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida",
                    },
                    minLength: {
                      value: 3,
                      message: "La contraseña debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "La contraseña debe tener como máximo 50 caracteres",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowOldPassword(!showOldPassword)} // Alterna la visibilidad
                >
                  {showOldPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.old_password && (
                <p className="text-red-500 text-sm">{errors.old_password.message}</p>
              )}
            </div>

            {/* Contraseña Nueva */}
            <div>
              <label className="block text-sm font-semibold">Contraseña Nueva</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  autoComplete="off"
                  className={`mt-1 p-2 w-full border rounded ${
                    errors.new_password ? "border-red-500" : ""
                  }`}
                  {...register("new_password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida",
                    },
                    minLength: {
                      value: 3,
                      message: "La contraseña debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "La contraseña debe tener como máximo 50 caracteres",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-sm">{errors.new_password.message}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-semibold">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  autoComplete="off"
                  className={`mt-1 p-2 w-full border rounded ${
                    errors.password_confirmation ? "border-red-500" : ""
                  }`}
                  {...register("password_confirmation", {
                    required: {
                      value: true,
                      message: "La confirmación de contraseña es requerida",
                    },
                    validate: (value) =>
                      value === newPassword || "Las contraseñas no coinciden",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6 gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded flex items-center gap-2"
            >
              <FaSave /> Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;