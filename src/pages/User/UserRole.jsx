import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut } from "../../services/apiService";
import { useToastHook } from "../../hooks/useToastHook";

const UserRole = ({ onClose, itemId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null); // Datos del usuario
  const [roles, setRoles] = useState([]); // Lista de todos los roles
  const [selectedRoles, setSelectedRoles] = useState([]); // Roles seleccionados
  const [selectAll, setSelectAll] = useState(false); // Estado para seleccionar/deseleccionar todos
  const { showToast } = useToastHook();

  // Cargar los datos a editar
  useEffect(() => {
    fetchDataSequentially();
  }, [itemId]);

  // Obtener datos en secuencia: primero el rol, luego los permisos
  const fetchDataSequentially = async () => {
    setIsLoading(true);

    try {
      // Paso 1: Obtener el usuario con sus roles asignados
      const userResponse = await apiGet(`user/getUser/${itemId}`, {
        included: "roles",
      });
      const {
        data: userData,
        message: userMessage,
        success: userSuccess,
      } = userResponse;

      if (!userSuccess) {
        showToast(userMessage, "error");
        return;
      }

      // Guardar los datos del usuario y los roles asignados
      setData(userData);
      setSelectedRoles(userData.roles.map((role) => role.id));

      // Paso 2: Obtener todos los roles disponibles
      const rolesResponse = await apiGet(`role/getRoles`, {
        sort: "desc",
        search: "",
        page: 1,
        perPage: "all",
      });
      const {
        data: rolesData,
        message: rolesMessage,
        success: rolesSuccess,
      } = rolesResponse;

      if (!rolesSuccess) {
        showToast(rolesMessage, "error");
        return;
      }

      // Guardar todos los permisos disponibles
      setRoles(rolesData);
    } catch (error) {
      showToast(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (roleId) => {
    setSelectedRoles(
      (prevSelected) =>
        prevSelected.includes(roleId)
          ? prevSelected.filter((id) => id !== roleId) // Desmarcar permiso
          : [...prevSelected, roleId] // Marcar permiso
    );
  };

  // Seleccionar/Deseleccionar todos los roles
  const handleSelectAll = () => {
    if (selectAll) {
      // Deseleccionar todos
      setSelectedRoles([]);
    } else {
      // Seleccionar todos
      setSelectedRoles(roles.map((role) => role.id));
    }
    setSelectAll(!selectAll);
  };

  // Actualizar roles del usuario
  const assignRoleToUser = async () => {
    setIsLoading(true);

    try {
      const response = await apiPut(`user/assignRoleToUser/${itemId}`, {
        roles: selectedRoles, // Enviar los roles seleccionados
      });
      const { message, success } = response;

      if (success) {
        showToast("Roles actualizados correctamente.", "success");
      } else {
        showToast(message, "error");
      }
    } catch (error) {
      showToast(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor principal */}
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl relative">
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white transition duration-300 rounded-full p-2 shadow-md"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Título */}
        <h2 className="text-sm md:text-xl font-bold mb-6 text-center text-gray-800">
          Editar Roles: <br />
          <span className="text-blue-500">
            {data?.name + " " + data?.first_name + " " + data?.last_name}
          </span>
        </h2>

        {/* Mostrar loading mientras se cargan los datos */}
        {isLoading && <Loading />}

        {/* Botón para seleccionar/deseleccionar todos */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            {selectAll ? "Deseleccionar Todos" : "Seleccionar Todos"}
          </button>
        </div>

        {/* Lista de permisos en un grid de 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`flex items-center justify-between p-3 rounded-lg transition ${
                selectedRoles.includes(role.id)
                  ? "bg-blue-100 border border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {/* Nombre del permiso */}
              <label
                htmlFor={`role-${role.id}`}
                className="text-sm font-medium cursor-pointer select-none"
              >
                {role.name}
              </label>

              {/* Checkbox con efecto visual */}
              <input
                type="checkbox"
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.id)} // Verificar si el rol esta seleccionado
                onChange={() => handleCheckboxChange(role.id)} // Manejar cambios en el checkbox
                className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer transition duration-200 ease-in-out"
              />
            </div>
          ))}
        </div>

        {/* Botón para actualizar permisos */}
        <button
          onClick={assignRoleToUser}
          className="mt-6 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Actualizar Roles
        </button>
      </div>
    </div>
  );
};

export default UserRole;
