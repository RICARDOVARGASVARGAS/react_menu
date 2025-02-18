import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { AiOutlineClose } from "react-icons/ai";
import { apiGet, apiPut } from "../../services/apiService";
import { useToastHook } from "../../hooks/useToastHook";

const RolePermission = ({ onClose, itemId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null); // Datos del rol
  const [permissions, setPermissions] = useState([]); // Lista de todos los permisos
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Permisos seleccionados
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
      // Paso 1: Obtener el rol con sus permisos asignados
      const roleResponse = await apiGet(`role/getRole/${itemId}`, {
        included: "permissions",
      });

      // console.log(roleResponse);
      const {
        data: roleData,
        message: roleMessage,
        success: roleSuccess,
      } = roleResponse;

      if (!roleSuccess) {
        showToast(roleMessage, "error");
        return;
      }

      // Guardar los datos del rol y los permisos asignados
      setData(roleData);
      setSelectedPermissions(roleData.permissions.map((perm) => perm.id));

      // Paso 2: Obtener todos los permisos disponibles
      const permissionsResponse = await apiGet(`role/getPermissions`);
      const {
        data: permissionsData,
        message: permissionsMessage,
        success: permissionsSuccess,
      } = permissionsResponse;

      if (!permissionsSuccess) {
        showToast(permissionsMessage, "error");
        return;
      }

      // Guardar todos los permisos disponibles
      setPermissions(permissionsData);
    } catch (error) {
      showToast("Ocurrió un error al cargar los datos.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (permissionId) => {
    setSelectedPermissions(
      (prevSelected) =>
        prevSelected.includes(permissionId)
          ? prevSelected.filter((id) => id !== permissionId) // Desmarcar permiso
          : [...prevSelected, permissionId] // Marcar permiso
    );
  };

  // Seleccionar/Deseleccionar todos los permisos
  const handleSelectAll = () => {
    if (selectAll) {
      // Deseleccionar todos
      setSelectedPermissions([]);
    } else {
      // Seleccionar todos
      setSelectedPermissions(permissions.map((perm) => perm.id));
    }
    setSelectAll(!selectAll);
  };

  // Actualizar permisos del rol
  const updateRolePermissions = async () => {
    setIsLoading(true);

    try {
      const response = await apiPut(`role/updateRolePermissions/${itemId}`, {
        permissions: selectedPermissions, // Enviar los permisos seleccionados
      });
      const { message, success } = response;

      if (success) {
        showToast("Permisos actualizados correctamente.", "success");
      } else {
        showToast(message, "error");
      }
    } catch (error) {
      showToast("Ocurrió un error al actualizar los permisos", "error");
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Editar Permisos: <span className="text-blue-500">{data?.name}</span>
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
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className={`flex items-center justify-between p-3 rounded-lg transition ${
                selectedPermissions.includes(permission.id)
                  ? "bg-blue-100 border border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {/* Nombre del permiso */}
              <label
                htmlFor={`permission-${permission.id}`}
                className="text-sm font-medium cursor-pointer select-none"
              >
                {permission.name_es}
              </label>

              {/* Checkbox con efecto visual */}
              <input
                type="checkbox"
                id={`permission-${permission.id}`}
                checked={selectedPermissions.includes(permission.id)} // Verificar si el permiso está seleccionado
                onChange={() => handleCheckboxChange(permission.id)} // Manejar cambios en el checkbox
                className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer transition duration-200 ease-in-out"
              />
            </div>
          ))}
        </div>

        {/* Botón para actualizar permisos */}
        <button
          onClick={updateRolePermissions}
          className="mt-6 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Actualizar Permisos
        </button>
      </div>
    </div>
  );
};

export default RolePermission;
