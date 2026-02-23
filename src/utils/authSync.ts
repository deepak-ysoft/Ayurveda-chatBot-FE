import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import type {
  SocialLoginResponse,
  User,
} from "../types";

export interface SyncResponse {
  success: boolean;
  error?: string;
  isOnboardingCompleted?: boolean;
}

export const syncWithBackend = async (
  provider: string,
  idToken: string,
  providerId: string = "",
): Promise<SyncResponse> => {
  try {
    const response =
      await api.post<SocialLoginResponse>(
        "/auth/social-login",
        {
          provider,
          idToken,
          providerId,
        },
      );

    const { token, isOnboardingCompleted } =
      response.data;

    // We need to fetch the user details or rely on common fields
    // For now, let's assume we fetch the user or the login returns it
    // If /auth/social-login only returns token and onboarding status,
    // we might need an additional call or have it return user info.
    // Based on src/types/index.ts, SocialLoginResponse is limited.

    // Let's check how Login.tsx handles it.
    // In Login.tsx: const { token, userId, ...userData } = response.data;
    // But Login.tsx uses /auth/login, not /auth/social-login.

    // In SocialLoginButtons.tsx:
    // localStorage.setItem("auth_token", token);
    // If it only has token and onboarding, we might need to set a dummy user
    // or fetch profile.

    const user: User = {
      id: providerId || "social-user",
      name: "User", // This should ideally come from backend
      email: "",
      isOnboardingCompleted,
    };

    useAuthStore.getState().setAuth(user, token);

    return {
      success: true,
      isOnboardingCompleted,
    };
  } catch (err: any) {
    console.error(
      `${provider} sync failed:`,
      err,
    );
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};
