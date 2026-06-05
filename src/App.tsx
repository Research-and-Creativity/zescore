// src/App.tsx
import React from 'react';
import KioskLayout from './Layouts/KioskLayout';

/**
 * Root Application Component.
 * Acts as the entry orchestrator, injecting pages into the secure Kiosk layout wrapper.
 */
function App(): React.JSX.Element {
  return (
    <KioskLayout>
      {/* 
        Temporary placeholder view to verify layout rendering.
        This will be replaced by the <KioskMain /> orchestrator component in the next step.
      */}
      <div className="text-center p-8 bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-2xl max-w-sm shadow-xl">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Kiosk Layout Active
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Secure device lock frame successfully rendered. Ready for the evaluation module.
        </p>
      </div>
    </KioskLayout>
  );
}

export default App;