// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { useKioskStore } from "./useKioskStore";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (
    user: User,
    token: string,
    teamMeta?: { teamId: string; teamName: string; boothNumber: string },
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token, teamMeta) => {
        localStorage.setItem("zescore_token", token);
        set({ user, token, isAuthenticated: true });

        // Kalau login sebagai participant, kunci kiosk ke stand ini
        if (user.role === "participant" && teamMeta) {
          useKioskStore.getState().setTeamContext({
            teamId: teamMeta.teamId,
            teamName: teamMeta.teamName,
            boothNumber: teamMeta.boothNumber,
          });
        }
      },

      logout: () => {
        localStorage.removeItem("zescore_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "zescore-auth" },
  ),
);
