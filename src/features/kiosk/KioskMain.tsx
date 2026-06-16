// src/features/kiosk/KioskMain.tsx
import React, { useState } from 'react'
import { useKioskStore } from '@/store/useKioskStore'
import api from '@/config/api'

const KioskMain: React.FC = () => {
  const { teamContext, setEvaluator, setStep } = useKioskStore()
  const [idInput, setIdInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Tidak ada deteksi tipe di FE — sepenuhnya dari validasi BE (cek role di DB)
  const canSubmit = idInput.trim().length >= 7

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamContext) { setError('Stand belum terkunci. Hubungi panitia.'); return }
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/kiosk/validate-evaluator', {
        idNumber: idInput.trim(),
        teamId: teamContext.teamId,
      })
      setEvaluator({
        idNumber: data.data.idNumber,
        name: data.data.name,
        type: data.data.type,
        remaining: data.data.remaining,
      })
      setStep('CATEGORY_SELECT')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(msg ?? 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Stand badge */}
      {teamContext && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Stand {teamContext.boothNumber} — {teamContext.teamName}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--zetech-light)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: 'var(--zetech-blue)' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masukkan Identitas</h2>
          <p className="text-sm text-slate-500 mt-2">Input NIM (mahasiswa) atau NIDN (dosen juri)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full text-center text-3xl font-mono font-bold tracking-widest py-5 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder:text-slate-300 placeholder:text-xl placeholder:tracking-normal focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
              required
            />
          </div>

          {/* Hint panjang input */}
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
            style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
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