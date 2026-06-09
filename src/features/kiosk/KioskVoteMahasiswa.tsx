// src/features/kiosk/KioskVoteMahasiswa.tsx
import React, { useState } from 'react';
import { useKioskStore } from '../../store/useKioskStore';

interface ProjectGroup {
  readonly id: number;
  readonly stanNumber: string;
  readonly title: string;
  readonly category: string;
}

// Data dummy kelompok pameran untuk keperluan simulasi expo
const DUMMY_GROUPS: readonly ProjectGroup[] = [
  { id: 1, stanNumber: "A01", title: "Smart Trash Can IoT", category: "Hardware & IoT" },
  { id: 2, stanNumber: "A02", title: "E-Learning Gamification", category: "Web Application" },
  { id: 3, stanNumber: "B01", title: "Mental Health AI Tracker", category: "Mobile Application" },
  { id: 4, stanNumber: "B02", title: "SaaS Point of Sales (POS)", category: "Web Application" },
  { id: 5, stanNumber: "C01", title: "Augmented Reality History Book", category: "Multimedia & AR" },
  { id: 6, stanNumber: "C02", title: "Crypto Portfolio Analytics", category: "Cybersecurity & Blockchain" },
];

/**
 * KioskVoteMahasiswa Component.
 * Provides an interactive grid interface for students to cast their vote for expo projects.
 */
const KioskVoteMahasiswa: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const { setStep, resetKiosk } = useKioskStore();

  const handleConfirmVote = () => {
    if (selectedGroupId === null) return;
    
    // Proses pencatatan vote tim Dev 2 bisa ditaruh di sini nantinya.
    // Untuk alur sekarang, langsung alihkan ke halaman sukses.
    setStep('SUCCESS');
  };

  return (
    <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xl shadow-slate-200/50 transition-all duration-300 flex flex-col h-[85vh]">
      
      {/* Header Halaman */}
      <div className="text-center mb-8 shrink-0">
        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
          Kiosk Voting Mahasiswa
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
          Pilih Kelompok Terfavorit
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ketuk salah satu kartu kelompok di bawah ini, kemudian tekan tombol konfirmasi di bawah.
        </p>
      </div>

      {/* Grid Kartu Kelompok (Scrollable jika data banyak) */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 content-start">
        {DUMMY_GROUPS.map((group) => {
          const isSelected = selectedGroupId === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between h-44 ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
              }`}
            >
              {/* Atas: Nomor Stan & Kategori */}
              <div className="flex justify-between items-start w-full">
                <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border tracking-wider ${
                  isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'
                }`}>
                  STAN {group.stanNumber}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {group.category}
                </span>
              </div>

              {/* Tengah: Judul Proyek */}
              <h3 className={`text-lg font-black tracking-tight leading-snug mt-3 line-clamp-2 ${
                isSelected ? 'text-blue-950' : 'text-slate-800 group-hover:text-slate-900'
              }`}>
                {group.title}
              </h3>

              {/* Indikator Checkmark jika Terpilih */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm animate-scale-up">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Panel Kontrol Aksi */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 shrink-0">
        <button
          onClick={resetKiosk}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-[0.98]"
        >
          Batalkan & Keluar
        </button>

        <button
          onClick={handleConfirmVote}
          disabled={selectedGroupId === null}
          className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-black text-sm tracking-wide shadow-lg transition-all duration-150 active:scale-[0.98] ${
            selectedGroupId !== null
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/10'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Konfirmasi Pilihan Vote
        </button>
      </div>

    </div>
  );
};

export default KioskVoteMahasiswa;