// src/features/kiosk/KioskMain.tsx
import React, { useState, useEffect } from 'react';
import { useKioskStore } from '../../store/useKioskStore';
import type { EvaluatorType } from '../../store/useKioskStore'; // Perbaikan: Gunakan type-only import di sini

/**
 * KioskMain component.
 * Features a high-visibility input form for evaluator identification (NIM/NIDN).
 * Includes auto-detection of evaluator types based on character length constraints.
 */
const KioskMain: React.FC = () => {
  const [idInput, setIdInput] = useState<string>('');
  const [detectedType, setDetectedType] = useState<EvaluatorType>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { setEvaluator, setStep } = useKioskStore();

  // Efek samping untuk mendeteksi tipe penilai secara otomatis berdasarkan panjang karakter input
  useEffect(() => {
    const cleanInput = idInput.trim();
    if (cleanInput.length === 12) {
      setDetectedType('MAHASISWA');
      setError(null);
    } else if (cleanInput.length === 10) {
      setDetectedType('DOSEN');
      setError(null);
    } else {
      setDetectedType(null);
    }
  }, [idInput]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalInput = idInput.trim();

    // Validasi awal kepatuhan panjang karakter
    if (!detectedType) {
      setError('Nomor identitas tidak valid. NIM harus 12 digit, NIDN harus 10 digit.');
      return;
    }

    // Daftarkan data ke Zustand store global
    setEvaluator(finalInput, detectedType);

    // Alihkan halaman berdasarkan tipe yang terdeteksi otomatis
    if (detectedType === 'MAHASISWA') {
      setStep('VOTE_MAHASISWA');
    } else if (detectedType === 'DOSEN') {
      setStep('SCORE_DOSEN');
    }
  };

  return (
    <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xl shadow-slate-200/50 transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Selamat Datang Penilai
        </h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Silakan masukkan NIM atau NIDN Anda untuk mulai menilai.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="id-number" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Nomor Identitas (NIM / NIDN)
          </label>
          <input
            id="id-number"
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={12}
            value={idInput}
            onChange={(e) => setIdInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Contoh: 103122400013 atau 20850012"
            className="w-full text-center text-2xl font-mono font-bold tracking-widest p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-300 placeholder:tracking-normal focus:outline-none focus:border-slate-400 focus:bg-white transition-all duration-200 shadow-inner"
            autoFocus
            required
          />
        </div>

        {/* Tanda Deteksi Otomatis - Responsif Terhadap State */}
        {detectedType && (
          <div className="flex justify-center animate-fade-in">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-sm border ${
              detectedType === 'MAHASISWA' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${detectedType === 'MAHASISWA' ? 'bg-blue-600' : 'bg-emerald-600'}`} />
              Terdeteksi Sebagai: {detectedType}
            </span>
          </div>
        )}

        {/* Notifikasi Error Validasi Awal */}
        {error && (
          <p className="text-xs font-semibold text-red-600 text-center bg-red-50 py-2.5 px-4 rounded-xl border border-red-200 animate-shake">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.98] shadow-lg shadow-slate-900/10"
        >
          Lanjutkan Evaluasi
        </button>
      </form>
    </div>
  );
};

export default KioskMain;