// src/layouts/KioskLayout.tsx
import React from 'react';

interface KioskLayoutProps {
  readonly children: React.ReactNode;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900 flex flex-col font-sans select-none relative">

      {/* Main Content */}
      <main className="flex-1 w-full h-full flex flex-col justify-center items-center p-6 relative z-10">
        {children}
      </main>

      {/* Decorative Blur Ambient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/3 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/3 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
    </div>
  );
};

export default KioskLayout;