// src/features/kiosk/KioskScoreDosen.tsx
import React, { useState } from 'react'
import { useKioskStore } from '@/store/useKioskStore'
import api from '@/config/api'

const KioskScoreDosen: React.FC = () => {
    const { evaluator, teamContext, selectedCategory, setStep, setEvaluator, resetKiosk } = useKioskStore()

    const [rawInput, setRawInput] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [confirm, setConfirm] = useState(false)

    if (!evaluator || !teamContext || !selectedCategory) return null

    // ── Validasi ketat ────────────────────────────────────────────────────────
    const numScore = rawInput === '' ? NaN : Number(rawInput)
    const isInteger = rawInput !== '' && /^\d+$/.test(rawInput)       // hanya angka bulat
    const inRange = !isNaN(numScore) && numScore >= 0 && numScore <= 100
    const isValid = isInteger && inRange

    const validationMsg = () => {
        if (rawInput === '') return null
        if (!isInteger) return 'Masukkan angka bulat (tanpa titik/koma).'
        if (numScore < 0) return 'Nilai minimal adalah 0.'
        if (numScore > 100) return 'Nilai maksimal adalah 100.'
        return null
    }
    const validMsg = validationMsg()

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // Hanya izinkan angka 0-3 digit (max "100")
        if (/^\d{0,3}$/.test(val)) {
            setRawInput(val)
            setError(null)
        }
    }

    const handleSubmit = async () => {
        if (!isValid) return
        setLoading(true)
        setError(null)
        try {
            await api.post('/kiosk/score-lecturer', {
                evaluatorId: evaluator.idNumber,
                teamId: teamContext.teamId,
                category: selectedCategory,
                score: numScore,
            })

            const stillRemaining = evaluator.remaining.filter(r => r !== selectedCategory)
            if (stillRemaining.length > 0) {
                setEvaluator({ ...evaluator, remaining: stillRemaining })
                resetKiosk()
            } else {
                setStep('SUCCESS')
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
            setError(msg ?? 'Gagal menyimpan penilaian.')
            setConfirm(false)
        } finally {
            setLoading(false)
        }
    }

    const catLabel = selectedCategory === 'POSTER' ? 'Poster 🖼️' : 'Product 💡'
    const pct = isValid ? numScore : 0
    const barColor = pct >= 80 ? '#16a34a' : pct >= 60 ? '#4F8EF7' : '#f59e0b'
    const barLabel = pct >= 80 ? 'Sangat Baik' : pct >= 60 ? 'Cukup Baik' : pct > 0 ? 'Perlu Perbaikan' : ''

    return (
        <div className="w-full max-w-lg">
            {/* Stand info */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
                    Stand {teamContext.boothNumber} — {teamContext.teamName}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ background: 'var(--zetech-light)' }}>
                        <span className="text-3xl">{selectedCategory === 'POSTER' ? '🖼️' : '💡'}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Penilaian {catLabel}</h2>
                    <p className="text-sm text-slate-500 mt-1">{evaluator.name}</p>
                </div>

                {/* Range indicator */}
                <div className="flex justify-between text-xs font-bold mb-2 px-1"
                    style={{ color: 'var(--text-secondary)' }}>
                    <span>0</span>
                    <span style={{ color: 'var(--zetech-blue)' }}>Rentang Nilai: 0 – 100</span>
                    <span>100</span>
                </div>

                {/* Slider visual */}
                <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'var(--card-border)' }}>
                    <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, background: barColor }} />
                </div>

                {/* Input utama */}
                <div className="relative mb-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={rawInput}
                        onChange={handleInput}
                        placeholder="0"
                        maxLength={3}
                        autoFocus
                        className="w-full text-center font-black tracking-tight rounded-2xl bg-slate-50 border-2 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white transition-all"
                        style={{
                            fontSize: 64,
                            lineHeight: 1.1,
                            paddingTop: 20,
                            paddingBottom: 20,
                            borderColor: validMsg ? '#DC2626' : isValid ? '#16a34a' : 'var(--card-border)',
                        }}
                    />
                    {/* Unit label */}
                    <span className="absolute right-5 bottom-5 text-sm font-semibold"
                        style={{ color: 'var(--text-secondary)' }}>/ 100</span>
                </div>

                {/* Feedback */}
                <div className="min-h-6 mb-4 text-center">
                    {validMsg ? (
                        <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>⚠️ {validMsg}</p>
                    ) : isValid && barLabel ? (
                        <p className="text-xs font-semibold" style={{ color: barColor }}>
                            {barLabel} {pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '📝'}
                        </p>
                    ) : null}
                </div>

                {/* Quick pick buttons */}
                <div className="grid grid-cols-5 gap-2 mb-5">
                    {[60, 70, 75, 80, 85, 90, 95, 100].map(v => (
                        <button key={v}
                            onClick={() => { setRawInput(String(v)); setError(null) }}
                            className="py-2 rounded-xl text-xs font-bold transition-all"
                            style={{
                                background: numScore === v ? 'var(--zetech-blue)' : 'var(--body-bg)',
                                color: numScore === v ? 'white' : 'var(--text-primary)',
                                border: `1.5px solid ${numScore === v ? 'var(--zetech-blue)' : 'var(--card-border)'}`,
                            }}>
                            {v}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="text-xs px-4 py-3 rounded-xl font-semibold mb-4"
                        style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        {error}
                    </div>
                )}

                <button onClick={() => setConfirm(true)}
                    disabled={!isValid || loading}
                    className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                    style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
                    Konfirmasi Nilai →
                </button>

                <button onClick={resetKiosk}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold"
                    style={{ color: 'var(--text-secondary)', border: '1.5px solid var(--card-border)' }}>
                    ← Kembali
                </button>
            </div>

            {/* Confirm dialog */}
            {confirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(13,27,75,0.6)', backdropFilter: 'blur(6px)' }}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'var(--zetech-light)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                style={{ color: 'var(--zetech-blue)' }}>
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">Konfirmasi Penilaian</h3>
                        <p className="text-sm text-slate-500 mb-3">
                            Kategori: <span className="font-bold" style={{ color: 'var(--zetech-blue)' }}>{catLabel}</span>
                        </p>
                        <div className="rounded-2xl py-4 mb-4" style={{ background: 'var(--body-bg)' }}>
                            <p className="text-6xl font-black" style={{ color: 'var(--zetech-blue)' }}>{rawInput}</p>
                            <p className="text-xs text-slate-400 mt-1">dari 100</p>
                        </div>
                        <p className="text-xs text-amber-600 bg-amber-50 px-4 py-2 rounded-xl mb-5 font-medium">
                            ⚠️ Nilai tidak dapat diubah setelah dikonfirmasi
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirm(false)} disabled={loading}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold border-2"
                                style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                                Batal
                            </button>
                            <button onClick={handleSubmit} disabled={loading}
                                className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))', opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Menyimpan...' : 'Simpan Nilai'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default KioskScoreDosen