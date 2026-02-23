import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Onboarding from "../pages/Onboarding";
import Dashboard from "../pages/Dashboard";
import Chat from "../pages/Chat";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );
  return isAuthenticated ? children : (
      <Navigate to="/login" />
    );
};

import AuthHandler from "../components/AuthHandler";

export const router = createBrowserRouter([
  {
    element: <AuthHandler />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
