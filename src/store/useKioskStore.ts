// src/store/useKioskStore.ts
import { create } from "zustand";

export type KioskStep =
  | "IDENTIFICATION"
  | "CATEGORY_SELECT" // pilih poster/product/keduanya
  | "VOTE_MAHASISWA" // konfirmasi vote mahasiswa
  | "SCORE_DOSEN" // input nilai dosen
  | "SUCCESS";

export type EvaluatorType = "STUDENT" | "LECTURER" | null;
export type Category = "POSTER" | "PRODUCT";

export interface TeamContext {
  readonly teamId: string;
  readonly teamName: string;
  readonly boothNumber: string;
}

export interface EvaluatorInfo {
  idNumber: string;
  name: string;
  type: EvaluatorType;
  remaining: Category[]; // kategori yang belum dinilai
}

interface KioskState {
  step: KioskStep;
  evaluator: EvaluatorInfo | null;
  teamContext: TeamContext | null;
  selectedCategory: Category | null; // kategori yang sedang diproses

  setStep: (step: KioskStep) => void;
  setEvaluator: (e: EvaluatorInfo) => void;
  setTeamContext: (ctx: TeamContext) => void;
  setSelectedCategory: (c: Category) => void;
  lockToTeam: (teamId: string, teamName: string, boothNumber: string) => void;
  resetKiosk: () => void; // reset ke IDENTIFICATION, teamContext tetap
}

export const useKioskStore = create<KioskState>((set) => ({
  step: "IDENTIFICATION",
  evaluator: null,
  teamContext: null,
  selectedCategory: null,

  setStep: (step) => set({ step }),
  setEvaluator: (e) => set({ evaluator: e }),
  setTeamContext: (ctx) => set({ teamContext: ctx }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),

  lockToTeam: (teamId, teamName, boothNumber) =>
    set({ teamContext: { teamId, teamName, boothNumber } }),

  // Reset ke form NIM — teamContext TIDAK direset (stand tetap terkunci)
  resetKiosk: () =>
    set({ step: "IDENTIFICATION", evaluator: null, selectedCategory: null }),
}));
