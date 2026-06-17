// src/features/kiosk/KioskMain.tsx
import React, { useState } from 'react'
import { useKioskStore } from '@/store/useKioskStore'
import api from '@/config/api'
import logo from '@/assets/zetech-logo.svg'

const KioskMain: React.FC = () => {
  const { setEvaluator, setStep } = useKioskStore()
  const [idInput, setIdInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const canSubmit = idInput.trim().length >= 7

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Cek identitas dulu (tanpa teamId) — pilih tim dilakukan setelah ini
      const { data } = await api.post('/kiosk/check-identity', {
        idNumber: idInput.trim(),
      })
      setEvaluator({
        idNumber: data.data.idNumber,
        name: data.data.name,
        type: data.data.type,
      })
      setStep('TEAM_SELECT')
      console.log(data)
    } catch (err: unknown) {
      console.log(err)
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(msg ?? 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
          <img src={logo} alt="Zetech" className="h-4 w-auto" />
          <span className="text-xs font-bold tracking-wide text-slate-500">PT3 EXPO 2026</span>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl shadow-slate-200/50">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--zetech-accent), transparent)' }} />
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--zetech-light)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: 'var(--zetech-blue)' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang!</h2>
          <p className="text-sm text-slate-500 mt-2">Masukkan NIM (mahasiswa) atau NIDN (dosen juri)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={12}
              value={idInput}
              onChange={e => { setIdInput(e.target.value.replace(/\D/g, '')); setError(null) }}
              placeholder="Ketik NIM atau NIDN..."
              autoFocus
              className="w-full text-center text-3xl font-mono font-bold tracking-widest py-5 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder:text-slate-300 placeholder:text-xl placeholder:tracking-normal focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
              required
            />
          </div>

          {idInput.length > 0 && idInput.length < 7 && (
            <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              Minimal 7 digit
            </p>
          )}

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-xs font-semibold"
              style={{ background: '#FEF2F2', color: '#DC2626' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !canSubmit}
            className="w-full py-4 rounded-2xl text-white font-bold text-base tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))', boxShadow: '0 4px 20px rgba(79,142,247,0.35)' }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Memverifikasi...
              </span>
            ) : 'Lanjutkan →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default KioskMain
