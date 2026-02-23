import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { syncWithBackend } from "../utils/authSync";
import { loginRequest } from "../authConfig";
import { Loader2 } from "lucide-react";

const SocialLoginButtons = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [isLoading, setIsLoading] =
    useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      const result = await syncWithBackend(
        "google",
        tokenResponse.access_token,
        "",
      );
      setIsLoading(false);

      if (result.success) {
        if (result.isOnboardingCompleted) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      } else {
        setError(
          result.error || "Google login failed",
        );
      }
    },
    onError: (error) => {
      console.error(
        "Google login failed:",
        error,
      );
      setError("Google login failed");
    },
  });

  const microsoftLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (err: any) {
      console.error(
        "Microsoft login failed:",
        err,
      );
      setError("Microsoft login failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button
        onClick={() => googleLogin()}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-4 border-2 border-ayurveda-earth/10 rounded-2xl font-bold text-ayurveda-brown hover:bg-ayurveda-leaf/5 transition-all active:scale-95 disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.12.75-2.5 1.12-3.71 1.12-2.87 0-5.3-1.94-6.17-4.54H2.18v2.85C4 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.83 14.15a6.6 6.6 0 0 1 0-4.3l0-2.85H2.18a11.96 11.96 0 0 0 0 10l3.65-2.85z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4 3.47 2.18 7.07l3.65 2.85c.87-2.6 3.3-4.54 6.17-4.54z"
            fill="#EA4335"
          />
        </svg>
        {isLoading ?
          <Loader2 className="w-5 h-5 animate-spin" />
        : "Sign in with Google"}
      </button>

      <button
        onClick={microsoftLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-4 border-2 border-ayurveda-earth/10 rounded-2xl font-bold text-ayurveda-brown hover:bg-ayurveda-leaf/5 transition-all active:scale-95 disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 23 23"
        >
          <path
            fill="#f3f3f3"
            d="M0 0h23v23H0z"
          />
          <path
            fill="#f35325"
            d="M1 1h10v10H1z"
          />
          <path
            fill="#81bc06"
            d="M12 1h10v10H12z"
          />
          <path
            fill="#05a6f0"
            d="M1 12h10v10H1z"
          />
          <path
            fill="#ffba08"
            d="M12 12h10v10H12z"
          />
        </svg>
        {isLoading ?
          <Loader2 className="w-5 h-5 animate-spin" />
        : "Sign in with Microsoft"}
      </button>
    </div>
  );
};

export default SocialLoginButtons;
