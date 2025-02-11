// components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Loading from "../Loading";

const ProtectedRoute = ({ children, requiredPermissions }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermissions) {
    const hasPermission = requiredPermissions.some((perm) =>
      user.permissions.includes(perm)
    );

    if (!hasPermission) {
      return <Navigate to="/no-permission-page" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
