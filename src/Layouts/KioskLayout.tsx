// src/layouts/KioskLayout.tsx
import React from 'react';

interface KioskLayoutProps {
  readonly children: React.ReactNode;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="w-full py-4 px-6 border-b border-slate-200 bg-white/70 backdrop-blur-md flex justify-between items-center z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-mono font-bold tracking-widest text-xs text-slate-500">
            ZECORE // KIOSK TERMINAL
          </span>
        </div>
        <div className="text-[10px] bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-mono text-slate-600 uppercase tracking-wider font-semibold">
          Device Locked Mode
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full h-full flex flex-col justify-center items-center p-6 relative z-10">
        {children}
      </main>

      {/* Decorative Blur Ambient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/[0.03] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/[0.03] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
    </div>
  );
};

export default KioskLayout;