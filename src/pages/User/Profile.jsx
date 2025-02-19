import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { FaCheck, FaSearch, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut, apiFetch, apiDelete } from "../../services/apiService";
import { useForm } from "react-hook-form";
import { handleBackendErrors } from "../../utils/handleBackendErrors ";
import { useToastHook } from "../../hooks/useToastHook";
import { useAuth } from "../../hooks/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const { id, document, name, first_name, last_name, email, phone_number } =
    user;
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastHook();

  const [form, setForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  changePassword = async () => {
    try {
      setIsLoading(true);
      const response = await apiPut(`auth/password`, form);
      showToast(
        "Contraseña cambiada correctamente",
        "success",
        1000,
        "top-center"
      );
    } catch (error) {
      showToast("Error al cambiar la contraseña", "error", 1000, "top-center");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-2 bg-white shadow-lg rounded-lg relative max-h-[80vh] overflow-y-auto">
        {isLoading && <Loading />}

        <h2 className="text-2xl font-bold mb-4 text-center">MI PERFIL</h2>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">
                N° Documento
              </label>
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
              <label className="block text-sm font-semibold">
                Correo Electrónico
              </label>
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
      </div>
    </div>
  );
};

export default Profile;
