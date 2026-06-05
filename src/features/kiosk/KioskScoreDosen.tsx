// src/features/kiosk/KioskScoreDosen.tsx
import React, { useState, useEffect } from 'react';
import { useKioskStore } from '../../store/useKioskStore';

interface FormScores {
  readonly inovasi: string;
  readonly teknis: string;
  readonly presentasi: string;
}

/**
 * KioskScoreDosen Component.
 * Features a clean assessment form for lecturers to evaluate project groups.
 * Includes real-time calculation of average scores and range constraints validation.
 */
const KioskScoreDosen: React.FC = () => {
  const { setStep, resetKiosk } = useKioskStore();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [scores, setScores] = useState<FormScores>({ inovasi: '', teknis: '', presentasi: '' });
  const [average, setAverage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Efek samping untuk menghitung nilai rata-scale secara otomatis dan real-time
  useEffect(() => {
    const valInovasi = parseFloat(scores.inovasi) || 0;
    const valTeknis = parseFloat(scores.teknis) || 0;
    const valPresentasi = parseFloat(scores.presentasi) || 0;

    const activeFields = [scores.inovasi, scores.teknis, scores.presentasi].filter(f => f !== '').length;

    if (activeFields > 0) {
      const total = valInovasi + valTeknis + valPresentasi;
      setAverage(parseFloat((total / 3).toFixed(1)));
    } else {
      setAverage(0);
    }
  }, [scores]);

  const handleInputChange = (field: keyof FormScores, value: string) => {
    // Hanya menerima input angka numerik kosong atau valid
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue !== '') {
      const num = parseInt(cleanValue, 10);
      if (num > 100) return; // Mengunci batas maksimal input angka di 100
    }

    setScores(prev => ({ ...prev, [field]: cleanValue }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedGroup) {
      setError('Silakan pilih kelompok proyek yang akan dinilai terlebih dahulu.');
      return;
    }

    if (!scores.inovasi || !scores.teknis || !scores.presentasi) {
      setError('Semua parameter aspek penilaian wajib diisi angka.');
      return;
    }

    // Alur penyerahan nilai sukses, arahkan ke komponen KioskSuccess
    setStep('SUCCESS');
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xl shadow-slate-200/50 transition-all duration-300">
      
      {/* Header Form */}
      <div className="text-center mb-8">
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
          Kiosk Penilaian Dosen / Juri
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
          Lembar Evaluasi Proyek
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilih kelompok pameran dan berikan penilaian numerik rentang rentang skala 1 - 100.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Dropdown Pilihan Kelompok */}
        <div>
          <label htmlFor="select-group" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Pilih Kelompok Proyek
          </label>
          <select
            id="select-group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all duration-200"
            required
          >
            <option value="" disabled hidden>-- Ketuk Untuk Memilih Kelompok Pameran --</option>
            <option value="1">STAN A01 - Smart Trash Can IoT</option>
            <option value="2">STAN A02 - E-Learning Gamification</option>
            <option value="3">STAN B01 - Mental Health AI Tracker</option>
            <option value="4">STAN B02 - SaaS Point of Sales (POS)</option>
            <option value="5">STAN C01 - Augmented Reality History Book</option>
            <option value="6">STAN C02 - Crypto Portfolio Analytics</option>
          </select>
        </div>

        {/* Input Parameter Nilai Berjajar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Aspek Inovasi */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
            <label htmlFor="score-inovasi" className="block text-[11px] font-black text-slate-400 uppercase tracking-wide mb-2">
              Aspek Inovasi
            </label>
            <input
              id="score-inovasi"
              type="text"
              inputMode="numeric"
              maxLength={3}
              value={scores.inovasi}
              onChange={(e) => handleInputChange('inovasi', e.target.value)}
              placeholder="0-100"
              className="w-full text-center text-xl font-mono font-black p-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-all duration-150"
              required
            />
          </div>

          {/* Aspek Teknis */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
            <label htmlFor="score-teknis" className="block text-[11px] font-black text-slate-400 uppercase tracking-wide mb-2">
              Kualitas Teknis
            </label>
            <input
              id="score-teknis"
              type="text"
              inputMode="numeric"
              maxLength={3}
              value={scores.teknis}
              onChange={(e) => handleInputChange('teknis', e.target.value)}
              placeholder="0-100"
              className="w-full text-center text-xl font-mono font-black p-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-all duration-150"
              required
            />
          </div>

          {/* Aspek Presentasi */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
            <label htmlFor="score-presentasi" className="block text-[11px] font-black text-slate-400 uppercase tracking-wide mb-2">
              Presentasi / Pitch
            </label>
            <input
              id="score-presentasi"
              type="text"
              inputMode="numeric"
              maxLength={3}
              value={scores.presentasi}
              onChange={(e) => handleInputChange('presentasi', e.target.value)}
              placeholder="0-100"
              className="w-full text-center text-xl font-mono font-black p-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-all duration-150"
              required
            />
          </div>

        </div>

        {/* Panel Akumulasi Nilai Rata-rata Real-time */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-emerald-950">Akumulasi Nilai Rata-rata</h4>
            <p className="text-xs text-emerald-600 mt-0.5">Dihitung otomatis dari ketiga aspek di atas.</p>
          </div>
          <div className="text-3xl font-mono font-black text-emerald-700 bg-white border border-emerald-200/60 px-5 py-2 rounded-xl shadow-inner">
            {average}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <p className="text-xs font-semibold text-red-600 text-center bg-red-50 py-2.5 px-4 rounded-xl border border-red-200">
            {error}
          </p>
        )}

        {/* Tombol Aksi */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetKiosk}
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-[0.98]"
          >
            Kembali & Keluar
          </button>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-wide shadow-lg shadow-slate-900/10 transition-all duration-150 active:scale-[0.98]"
          >
            Kunci & Kirim Nilai
          </button>
        </div>

      </form>
    </div>
  );
};

export default KioskScoreDosen;