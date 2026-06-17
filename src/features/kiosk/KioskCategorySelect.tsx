// src/features/kiosk/KioskCategorySelect.tsx
import React, { useEffect, useState } from 'react'
import { useKioskStore, type Category } from '@/store/useKioskStore'
import api from '@/config/api'

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
    category, teamName, evaluatorName, onConfirm, onCancel, loading,
}: {
    category: Category | 'BOTH'; teamName: string; evaluatorName: string
    onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
    const label = category === 'BOTH' ? 'Poster & Product' : category === 'POSTER' ? 'Poster' : 'Product'
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(13,27,75,0.6)', backdropFilter: 'blur(6px)' }}>
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'var(--zetech-light)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        style={{ color: 'var(--zetech-blue)' }}>
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Konfirmasi Vote</h3>
                <p className="text-sm text-slate-500 mb-1">
                    Halo, <span className="font-semibold text-slate-700">{evaluatorName}</span>
                </p>
                <p className="text-sm text-slate-500 mb-6">
                    Kamu akan vote <span className="font-bold" style={{ color: 'var(--zetech-blue)' }}>{label}</span> untuk<br />
                    <span className="font-bold text-slate-800">{teamName}</span>
                </p>
                <p className="text-xs text-amber-600 bg-amber-50 px-4 py-2 rounded-xl mb-6 font-medium">
                    ⚠️ Vote tidak dapat dibatalkan setelah dikonfirmasi
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))', opacity: loading ? 0.7 : 1 }}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Menyimpan...
                            </span>
                        ) : 'Ya, Vote Sekarang!'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const LABELS: Record<Category, { emoji: string; title: string; desc: string }> = {
    POSTER: { emoji: '🖼️', title: 'Poster', desc: 'Vote untuk karya poster tim ini' },
    PRODUCT: { emoji: '💡', title: 'Product', desc: 'Vote untuk produk/prototype tim ini' },
}

const KioskCategorySelect: React.FC = () => {
    const {
        evaluator, selectedTeam, remaining, setRemaining,
        setStep, setSelectedCategory, backToTeamSelect, resetKiosk,
    } = useKioskStore()

    const [pending, setPending] = useState<Category | 'BOTH' | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [checking, setChecking] = useState(true)
    const [blockedMsg, setBlockedMsg] = useState<string | null>(null)

    const isStudent = evaluator?.type === 'STUDENT'

    // Cek remaining categories untuk kombinasi evaluator + tim ini
    useEffect(() => {
        if (!evaluator || !selectedTeam) return
        let active = true

        const run = async () => {
            setChecking(true)
            setBlockedMsg(null)
            try {
                const { data } = await api.post('/kiosk/check-remaining', {
                    idNumber: evaluator.idNumber,
                    teamId: selectedTeam.teamId,
                })
                if (!active) return
                setRemaining(data.data.remaining)
                if (data.data.remaining.length === 0) {
                    setBlockedMsg(data.data.message ?? 'Anda sudah menilai semua kategori untuk tim ini.')
                }
            } catch (err: unknown) {
                if (!active) return
                const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
                setBlockedMsg(msg ?? 'Gagal memuat data. Coba lagi.')
                setRemaining([])
            } finally {
                if (active) setChecking(false)
            }
        }

        run()
        return () => { active = false }
    }, [evaluator, selectedTeam, setRemaining])

    if (!evaluator || !selectedTeam) return null

    const canBoth = remaining.length === 2

    const handleSelect = (choice: Category | 'BOTH') => {
        setError(null)
        setPending(choice)
    }

    const submitVote = async (cat: Category) => {
        await api.post('/kiosk/vote-student', {
            evaluatorId: evaluator.idNumber,
            teamId: selectedTeam.teamId,
            category: cat,
        })
    }

    const handleConfirm = async () => {
        if (!pending || pending === 'BOTH' && !isStudent) return
        setLoading(true)
        setError(null)
        try {
            if (pending === 'BOTH') {
                for (const cat of ['POSTER', 'PRODUCT'] as Category[]) {
                    await submitVote(cat)
                }
                setStep('SUCCESS')
            } else {
                await submitVote(pending as Category)
                const stillRemaining = remaining.filter(r => r !== pending)
                if (stillRemaining.length > 0) {
                    setRemaining(stillRemaining)
                    setPending(null)
                } else {
                    setStep('SUCCESS')
                }
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
            setError(msg ?? 'Gagal menyimpan. Coba lagi.')
            setPending(null)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectDosen = (cat: Category) => {
        setSelectedCategory(cat)
        setStep('SCORE_DOSEN')
    }

    if (checking) {
        return (
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-xl text-center">
                    <svg className="animate-spin mx-auto mb-3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ color: 'var(--zetech-accent)' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p className="text-sm text-slate-500">Memeriksa data...</p>
                </div>
            </div>
        )
    }

    if (blockedMsg) {
        return (
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: '#FEF3C7' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">Tidak Bisa Lanjut</h3>
                    <p className="text-sm text-slate-500 mb-6">{blockedMsg}</p>
                    <div className="flex gap-3">
                        <button onClick={backToTeamSelect}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold border-2"
                            style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                            Pilih Tim Lain
                        </button>
                        <button onClick={resetKiosk}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-lg">
            {/* Stand info */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
                    Stand {selectedTeam.boothNumber} — {selectedTeam.teamName}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
                <div className="text-center mb-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Halo,</p>
                    <h2 className="text-xl font-black text-slate-900">{evaluator.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isStudent ? 'Pilih kategori yang ingin kamu vote' : 'Pilih kategori untuk dinilai (satu per satu)'}
                    </p>
                    {!isStudent && canBoth && (
                        <p className="text-xs mt-1.5 px-3 py-1.5 rounded-xl inline-block"
                            style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                            💡 Nilai Poster dulu, lalu pilih tim ini lagi untuk nilai Product
                        </p>
                    )}
                </div>

                <div className="space-y-3 mb-5">
                    {remaining.map(cat => (
                        <button key={cat}
                            onClick={() => isStudent ? handleSelect(cat) : handleSelectDosen(cat)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98]"
                            style={{ borderColor: 'var(--card-border)', background: 'var(--body-bg)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--zetech-accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--zetech-light)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--body-bg)' }}>
                            <span className="text-3xl">{LABELS[cat].emoji}</span>
                            <div>
                                <p className="font-bold text-slate-900">{LABELS[cat].title}</p>
                                <p className="text-xs text-slate-500">{LABELS[cat].desc}</p>
                            </div>
                            <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--zetech-accent)' }}>
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    ))}

                    {canBoth && isStudent && (
                        <button onClick={() => handleSelect('BOTH')}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98]"
                            style={{ borderColor: 'var(--zetech-accent)', background: 'var(--zetech-light)' }}>
                            <span className="text-3xl">🗳️</span>
                            <div>
                                <p className="font-bold" style={{ color: 'var(--zetech-blue)' }}>Poster & Product</p>
                                <p className="text-xs text-slate-500">Vote keduanya sekaligus</p>
                            </div>
                            <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--zetech-accent)' }}>
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="text-xs px-4 py-3 rounded-xl font-semibold mb-4" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        {error}
                    </div>
                )}

                <button onClick={backToTeamSelect}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ color: 'var(--text-secondary)', border: '1.5px solid var(--card-border)' }}>
                    ← Pilih Tim Lain
                </button>
            </div>

            {pending && isStudent && (
                <ConfirmDialog
                    category={pending}
                    teamName={selectedTeam.teamName}
                    evaluatorName={evaluator.name}
                    onConfirm={handleConfirm}
                    onCancel={() => setPending(null)}
                    loading={loading}
                />
            )}
        </div>
    )
}

export default KioskCategorySelect