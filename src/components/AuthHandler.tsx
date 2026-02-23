import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import {
  useNavigate,
  Outlet,
} from "react-router-dom";
import { syncWithBackend } from "../utils/authSync";

const AuthHandler = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response =
          await instance.handleRedirectPromise();
        if (response) {
          console.log(
            "MSAL Redirect Response received in AuthHandler:",
            response,
          );

          const result = await syncWithBackend(
            "microsoft",
            response.idToken,
            response.account.localAccountId,
          );

          if (result.success) {
            if (result.isOnboardingCompleted) {
              navigate("/dashboard");
            } else {
              navigate("/onboarding");
            }
          }
        }
      } catch (error) {
        console.error(
          "Error handling MSAL redirect in AuthHandler:",
          error,
        );
      }
    };

    handleRedirect();
  }, [instance, navigate]);

  return <Outlet />;
};

export default AuthHandler;
