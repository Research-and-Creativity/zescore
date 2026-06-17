// src/store/useKioskStore.ts
import { create } from "zustand";

export type KioskStep =
  | "IDENTIFICATION"   // input NIM/NIDN
  | "TEAM_SELECT"      // pilih tim dari grid
  | "CATEGORY_SELECT"  // pilih poster/product/keduanya
  | "SCORE_DOSEN"      // input nilai dosen
  | "SUCCESS";

export type EvaluatorType = "STUDENT" | "LECTURER" | null;
export type Category = "POSTER" | "PRODUCT";

export interface SelectedTeam {
  readonly teamId: string;
  readonly teamName: string;
  readonly boothNumber: string;
}

export interface EvaluatorInfo {
  idNumber: string;
  name: string;
  type: EvaluatorType;
}

interface KioskState {
  step: KioskStep;
  evaluator: EvaluatorInfo | null;
  selectedTeam: SelectedTeam | null;
  selectedCategory: Category | null;
  remaining: Category[];   // kategori yang belum dinilai/divote untuk tim terpilih

  setStep: (step: KioskStep) => void;
  setEvaluator: (e: EvaluatorInfo) => void;
  setSelectedTeam: (t: SelectedTeam) => void;
  setSelectedCategory: (c: Category) => void;
  setRemaining: (r: Category[]) => void;
  resetKiosk: () => void;       // reset total — kembali ke input NIM
  backToTeamSelect: () => void; // kembali pilih tim lain (evaluator tetap)
}

export const useKioskStore = create<KioskState>((set) => ({
  step: "IDENTIFICATION",
  evaluator: null,
  selectedTeam: null,
  selectedCategory: null,
  remaining: [],

  setStep:             (step) => set({ step }),
  setEvaluator:        (e)    => set({ evaluator: e }),
  setSelectedTeam:     (t)    => set({ selectedTeam: t }),
  setSelectedCategory: (c)    => set({ selectedCategory: c }),
  setRemaining:        (r)    => set({ remaining: r }),

  // Reset total — dipanggil setelah selesai vote/nilai, balik ke awal
  resetKiosk: () =>
    set({
      step: "IDENTIFICATION",
      evaluator: null,
      selectedTeam: null,
      selectedCategory: null,
      remaining: [],
    }),

  // Kembali ke pilih tim lain tanpa input ulang NIM/NIDN
  backToTeamSelect: () =>
    set({ step: "TEAM_SELECT", selectedTeam: null, selectedCategory: null, remaining: [] }),
}));
