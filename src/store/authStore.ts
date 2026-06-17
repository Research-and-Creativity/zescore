// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Auth store sekarang HANYA untuk Admin.
// Kiosk (mesin kasir) bersifat publik dan tidak butuh auth sama sekali —
// state-nya dikelola sepenuhnya oleh useKioskStore.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("zescore_token", token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("zescore_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "zescore-auth" },
  ),
);
