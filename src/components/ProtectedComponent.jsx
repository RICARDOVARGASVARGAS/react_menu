import { useAuth } from "../hooks/AuthContext";

const ProtectedComponent = ({ children, requiredPermissions }) => {
  // 1. Obtener el usuario del contexto de autenticación
  const { user } = useAuth();

  // 2. Validación inicial: Si no hay permisos requeridos o el usuario no tiene permisos, retornar null
  if (!requiredPermissions || !user?.permissions) return null;

  // 3. Normalización de permisos: Convertir a array si es un string único
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  // 4. Verificación de permisos: ¿El usuario tiene AL MENOS UNO de los permisos requeridos?
  const hasPermission = permissions.some((perm) =>
    user.permissions.includes(perm)
  );

  // 5. Render condicional: Mostrar children solo si tiene el permiso
  return hasPermission ? children : null;
};

export default ProtectedComponent;
