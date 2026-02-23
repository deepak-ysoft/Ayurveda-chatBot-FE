import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        localStorage.setItem("auth_token", token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      updateUser: (updatedUser: Partial<User>) =>
        set((state: AuthState) => ({
          user:
            state.user ?
              { ...state.user, ...updatedUser }
            : null,
        })),
      logout: () => {
        localStorage.removeItem("auth_token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
