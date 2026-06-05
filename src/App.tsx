// src/App.tsx
import React from 'react';
import KioskLayout from './Layouts/KioskLayout';
import KioskMain from './features/kiosk/KioskMain';
import KioskVoteMahasiswa from './features/kiosk/KioskVoteMahasiswa';
import KioskScoreDosen from './features/kiosk/KioskScoreDosen'; // Impor baru
import KioskSuccess from './features/kiosk/KioskSuccess';
import { useKioskStore } from './store/useKioskStore';

/**
 * Root Application Component.
 * Orchestrates views inside the Kiosk layout environment based on global state steps.
 */
function App(): React.JSX.Element {
  const { step } = useKioskStore();

  return (
    <KioskLayout>
      {/* Mengatur percabangan halaman menggunakan Conditional Rendering yang bersih */}
      {step === 'IDENTIFICATION' && <KioskMain />}

      {step === 'VOTE_MAHASISWA' && <KioskVoteMahasiswa />}

      {step === 'SCORE_DOSEN' && <KioskScoreDosen />}

      {step === 'SUCCESS' && <KioskSuccess />}
    </KioskLayout>
  );
}

export default App;