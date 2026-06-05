// src/store/useKioskStore.ts
import { create } from 'zustand';

export type KioskStep = 'IDENTIFICATION' | 'VOTE_MAHASISWA' | 'SCORE_DOSEN' | 'SUCCESS';
export type EvaluatorType = 'MAHASISWA' | 'DOSEN' | null;

interface Evaluator {
  readonly idNumber: string;
  readonly type: EvaluatorType;
}

interface KioskState {
  readonly step: KioskStep;
  readonly evaluator: Evaluator | null;
  readonly setStep: (step: KioskStep) => void;
  readonly setEvaluator: (idNumber: string, type: EvaluatorType) => void;
  readonly resetKiosk: () => void;
}

/**
 * Zustand store to manage global state transitions for the Kiosk evaluation terminal.
 * Fixed implicit any parameters to comply with strict TypeScript configurations.
 */
export const useKioskStore = create<KioskState>((set) => ({
  step: 'IDENTIFICATION',
  evaluator: null,

  setStep: (step: KioskStep) => set({ step }),

  setEvaluator: (idNumber: string, type: EvaluatorType) => 
    set({ evaluator: { idNumber, type } }),

  resetKiosk: () => set({ step: 'IDENTIFICATION', evaluator: null }),
}));