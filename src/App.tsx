// src/App.tsx
import React from 'react';
import KioskLayout from './Layouts/KioskLayout';
import KioskMain from './features/kiosk/KioskMain';
import KioskVoteMahasiswa from './features/kiosk/KioskVoteMahasiswa'; // Impor baru
import KioskSuccess from './features/kiosk/KioskSuccess'; // Impor baru
import { useKioskStore } from './store/useKioskStore';

/**
 * Root Application Component.
 * Orchestrates views inside the Kiosk layout environment based on global state steps.
 */
function App(): React.JSX.Element {
  const { step, resetKiosk } = useKioskStore();

  return (
    <KioskLayout>
      {/* Mengatur percabangan halaman menggunakan Conditional Rendering yang bersih */}
      {step === 'IDENTIFICATION' && <KioskMain />}

      {step === 'VOTE_MAHASISWA' && <KioskVoteMahasiswa />}

      {step === 'SUCCESS' && <KioskSuccess />}

      {step === 'SCORE_DOSEN' && (
        <div className="text-center p-10 bg-white border border-slate-200 rounded-3xl max-w-sm shadow-xl shadow-slate-200/50">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl">D</div>
          <h1 className="text-xl font-black text-slate-900">Modul Penilaian Dosen</h1>
          <p className="text-xs text-slate-500 mt-2">Halaman form penilaian parameter aspek juri (Dev 3 Area).</p>
          <button onClick={resetKiosk} className="mt-6 text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 hover:bg-red-100 transition-all">
            Kembali ke Awal
          </button>
        </div>
      )}
    </KioskLayout>
  );
}

export default App;