// src/layouts/KioskLayout.tsx
import React from 'react';
import logo from '@/assets/zetech-logo.svg'
import KioskFooter from '@/components/common/KioskFooter'

interface KioskLayoutProps {
  readonly children: React.ReactNode;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900 flex flex-col font-sans select-none relative">

      {/* Watermark logo — besar, samar, di kanan bawah */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="absolute -bottom-16 -right-20 w-160 max-w-none opacity-[0.05] pointer-events-none select-none"
        style={{ filter: 'grayscale(1)' }}
      />
      {/* Watermark kedua — kecil, di kiri atas, untuk balance komposisi */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="absolute -top-12 -left-16 w-72 max-w-none opacity-[0.04] pointer-events-none select-none rotate-12"
        style={{ filter: 'grayscale(1)' }}
      />

      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(2,0,73,0.04)' }} aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(36,151,198,0.05)' }} aria-hidden="true" />

      {/* Main Content */}
      <main className="flex-1 w-full min-h-0 flex flex-col justify-center items-center p-6 relative z-10 overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <KioskFooter />
    </div>
  );
};

export default KioskLayout;