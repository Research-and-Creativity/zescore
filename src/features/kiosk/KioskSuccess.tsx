// src/features/kiosk/KioskSuccess.tsx
import React, { useEffect } from 'react';
import { useKioskStore } from '../../store/useKioskStore';

/**
 * KioskSuccess Component.
 * Displays a lightweight thank-you screen that auto-resets back to the login frame.
 */
const KioskSuccess: React.FC = () => {
  const { resetKiosk } = useKioskStore();

  // Otomatis reset aplikasi kembali ke form identitas utama setelah 4 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      resetKiosk();
    }, 4000);
    return () => clearTimeout(timer);
  }, [resetKiosk]);

  return (
    <div className="text-center p-12 bg-white border border-slate-200/80 rounded-3xl max-w-md shadow-xl shadow-slate-200/50 animate-fade-in">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Evaluasi Berhasil Dikirim!</h1>
      <p className="text-sm text-slate-500 mt-3 leading-relaxed">
        Terima kasih telah berpartisipasi dalam menilai proyek pameran. Pilihan Anda sangat berharga bagi perkembangan riset mahasiswa.
      </p>
      
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-300 animate-ping" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Kembali ke awal secara otomatis...
          </span>
        </div>
        <button 
          onClick={resetKiosk} 
          className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all"
        >
          Kembali Sekarang
        </button>
      </div>
    </div>
  );
};

export default KioskSuccess;