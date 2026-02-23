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

    const {
      token,
      userId,
      name,
      email,
      isOnboardingCompleted,
    } = response.data;

    const user: User = {
      id: userId,
      name,
      email,
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
