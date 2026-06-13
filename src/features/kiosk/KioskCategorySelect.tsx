// src/features/kiosk/KioskCategorySelect.tsx
import React, { useState } from 'react'
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
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
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
const KioskCategorySelect: React.FC = () => {
    const { evaluator, teamContext, setStep, setSelectedCategory, setEvaluator, resetKiosk } = useKioskStore()
    const [pending, setPending] = useState<Category | 'BOTH' | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!evaluator || !teamContext) return null

    const remaining = evaluator.remaining   // ["POSTER","PRODUCT"] | ["POSTER"] | ["PRODUCT"]
    const canBoth = remaining.length === 2
    const isStudent = evaluator.type === 'STUDENT'

    const handleSelect = (choice: Category | 'BOTH') => {
        setError(null)
        setPending(choice)
    }

    const handleConfirm = async () => {
        if (!pending) return
        setLoading(true)
        setError(null)

        try {
            if (pending === 'BOTH') {
                // Submit POSTER dulu, lalu PRODUCT
                for (const cat of ['POSTER', 'PRODUCT'] as Category[]) {
                    await submitVote(cat)
                }
                setStep('SUCCESS')
            } else {
                await submitVote(pending)
                // Setelah submit, cek apakah masih ada kategori lain
                const stillRemaining = remaining.filter(r => r !== pending)
                if (stillRemaining.length > 0) {
                    // Update remaining di store lalu kembali ke IDENTIFICATION
                    setEvaluator({ ...evaluator, remaining: stillRemaining })
                    setPending(null)
                    resetKiosk()   // back ke input NIM
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

    const submitVote = async (cat: Category) => {
        const endpoint = isStudent ? '/kiosk/vote-student' : '/kiosk/score-lecturer'
        // Untuk dosen, arahkan ke form input nilai dulu
        if (!isStudent) {
            setSelectedCategory(cat)
            setStep('SCORE_DOSEN')
            return
        }
        await api.post(endpoint, {
            evaluatorId: evaluator.idNumber,
            teamId: teamContext.teamId,
            category: cat,
        })
    }

    const LABELS: Record<Category, { emoji: string; title: string; desc: string }> = {
        POSTER: { emoji: '🖼️', title: 'Poster', desc: 'Vote untuk karya poster tim ini' },
        PRODUCT: { emoji: '💡', title: 'Product', desc: 'Vote untuk produk/prototype tim ini' },
    }

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
                {/* Greeting */}
                <div className="text-center mb-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Halo,</p>
                    <h2 className="text-xl font-black text-slate-900">{evaluator.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isStudent ? 'Pilih kategori yang ingin kamu vote' : 'Pilih kategori untuk dinilai (satu per satu)'}
                    </p>
                    {!isStudent && canBoth && (
                        <p className="text-xs mt-1.5 px-3 py-1.5 rounded-xl inline-block"
                            style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                            💡 Nilai Poster dulu, lalu masukkan NIDN lagi untuk nilai Product
                        </p>
                    )}
                </div>

                {/* Category buttons */}
                <div className="space-y-3 mb-5">
                    {remaining.map(cat => (
                        <button key={cat} onClick={() => handleSelect(cat)}
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

                    {/* Keduanya — hanya untuk mahasiswa, dosen harus nilai satu per satu */}
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

                <button onClick={resetKiosk}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ color: 'var(--text-secondary)', border: '1.5px solid var(--card-border)' }}>
                    ← Kembali / Ganti Identitas
                </button>
            </div>

            {/* Confirm dialog */}
            {pending && isStudent && (
                <ConfirmDialog
                    category={pending}
                    teamName={teamContext.teamName}
                    evaluatorName={evaluator.name}
                    onConfirm={handleConfirm}
                    onCancel={() => setPending(null)}
                    loading={loading}
                />
            )}

            {/* Untuk dosen: set category lalu langsung ke form nilai */}
            {pending && !isStudent && (() => {
                if (pending !== 'BOTH') {
                    setSelectedCategory(pending as import('@/store/useKioskStore').Category)
                    setStep('SCORE_DOSEN')
                    setPending(null)
                } else {
                    // Keduanya: mulai dari POSTER dulu
                    setSelectedCategory('POSTER')
                    setStep('SCORE_DOSEN')
                    setPending(null)
                }
                return null
            })()}
        </div>
    )
}

export default KioskCategorySelect