import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Loading from "../Loading";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
