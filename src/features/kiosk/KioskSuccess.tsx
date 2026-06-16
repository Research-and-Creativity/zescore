// src/features/kiosk/KioskSuccess.tsx
import React, { useEffect, useState } from 'react'
import { useKioskStore } from '@/store/useKioskStore'

const KioskSuccess: React.FC = () => {
  const { teamContext, evaluator, resetKiosk } = useKioskStore()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); resetKiosk(); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [resetKiosk])

  const isStudent = evaluator?.type === 'STUDENT'

  return (
    <div className="w-full max-w-sm text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-10">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
          {isStudent ? 'Vote Tercatat! 🎉' : 'Penilaian Tersimpan! 🎉'}
        </h2>
        <p className="text-sm text-slate-500 mb-1">
          Terima kasih, <span className="font-semibold text-slate-700">{evaluator?.name}</span>
        </p>
        {teamContext && (
          <p className="text-sm text-slate-500 mb-6">
            {isStudent ? 'Suara kamu untuk' : 'Penilaian untuk'}{' '}
            <span className="font-bold" style={{ color: 'var(--zetech-blue)' }}>
              {teamContext.teamName}
            </span>{' '}
            berhasil disimpan.
          </p>
        )}

        {/* Countdown */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-xl"
            style={{ borderColor: 'var(--zetech-accent)', color: 'var(--zetech-blue)' }}>
            {countdown}
          </div>
          <p className="text-xs text-slate-400">Layar reset otomatis dalam {countdown} detik</p>
        </div>

        <button onClick={resetKiosk}
          className="mt-6 w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
          Reset Sekarang
        </button>
      </div>
    </div>
  )
}

export default KioskSuccess
