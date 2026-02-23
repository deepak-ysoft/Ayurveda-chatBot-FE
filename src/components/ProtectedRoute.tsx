import { Navigate } from "react-router-dom";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );

  return isAuthenticated ? children : (
      <Navigate to="/login" />
    );
};

export default ProtectedRoute;
