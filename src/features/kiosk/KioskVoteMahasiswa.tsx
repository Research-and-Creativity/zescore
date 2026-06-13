// src/features/kiosk/KioskVoteMahasiswa.tsx
import React, { useState } from 'react';
import { useKioskStore } from '@/store/useKioskStore';
import api from '@/config/api';

/**
 * KioskVoteMahasiswa — konfirmasi vote ke tim stand ini.
 *
 * Setelah participant login, teamContext sudah tersimpan di store.
 * Mahasiswa tidak perlu pilih kelompok lagi — kiosk sudah terkunci
 * ke stand tertentu. Halaman ini hanya menampilkan info tim dan
 * tombol konfirmasi.
 */
const KioskVoteMahasiswa: React.FC = () => {
  const { evaluator, teamContext, setStep, resetKiosk } = useKioskStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard: seharusnya tidak terjadi kalau alur benar,
  // tapi tampilkan fallback jika teamContext belum ada
  if (!teamContext) {
    return (
      <div className="w-full max-w-sm bg-white border border-red-200 rounded-3xl p-10 text-center">
        <p className="text-sm font-semibold text-red-600 mb-4">
          Sesi kiosk tidak valid. Silakan login ulang sebagai tim peserta.
        </p>
        <button
          onClick={resetKiosk}
          className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all"
        >
          Kembali ke Awal
        </button>
      </div>
    );
  }

  const handleConfirmVote = async () => {
    if (!evaluator) return;
    setLoading(true);
    setError(null);

    try {
      await api.post('/kiosk/vote-student', {
        evaluatorId: evaluator.idNumber,
        projectId: teamContext.teamId,
      });
      setStep('SUCCESS');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(msg || 'Gagal menyimpan vote. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-10 transition-all duration-300">

      {/* Header */}
      <div className="text-center mb-8">
        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
          Konfirmasi Vote
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
          Vote Kelompok
        </h2>
        {evaluator?.name && (
          <p className="text-sm text-slate-500 mt-1">
            Halo, <span className="font-semibold text-slate-700">{evaluator.name}</span>!
          </p>
        )}
      </div>

      {/* Kartu tim — info stand yang sudah terkunci */}
      <div className="bg-blue-50/60 border-2 border-blue-200 rounded-2xl p-6 mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg tracking-wider mb-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          STAN {teamContext.boothNumber}
        </div>
        <h3 className="text-2xl font-black text-blue-950 tracking-tight leading-tight">
          {teamContext.teamName}
        </h3>
        <p className="text-xs text-blue-500 mt-2 font-medium">
          Anda akan memberikan 1 suara untuk tim ini
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs px-4 py-3 rounded-xl mb-4 bg-red-50 border border-red-200 text-red-600">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Catatan penting */}
      <p className="text-[11px] text-slate-400 text-center mb-6 leading-relaxed">
        Vote bersifat permanen dan tidak dapat diubah.<br />
        Pastikan pilihan Anda sudah benar sebelum konfirmasi.
      </p>

      {/* Aksi */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleConfirmVote}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base tracking-wide transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Menyimpan Vote...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Ya, Saya Vote Tim Ini!
            </>
          )}
        </button>

        <button
          onClick={resetKiosk}
          disabled={loading}
          className="w-full py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-[0.98] disabled:opacity-40"
        >
          Batalkan & Keluar
        </button>
      </div>
    </div>
  );
};

export default KioskVoteMahasiswa;