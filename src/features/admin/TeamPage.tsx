// src/features/admin/TeamPage.tsx
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/config/api'

interface TeamData {
    id: string
    teamName: string
    boothNumber: string
    createdAt: string
    _count: { assessments: number }
}
interface TeamForm { teamName: string; boothNumber: string; password: string }

const MOCK: TeamData[] = [
    { id: '1', teamName: 'Aqua Smart Monitor', boothNumber: 'A1', createdAt: new Date().toISOString(), _count: { assessments: 17 } },
    { id: '2', teamName: 'EduBot Learning', boothNumber: 'A2', createdAt: new Date().toISOString(), _count: { assessments: 20 } },
    { id: '3', teamName: 'WasteTrack IoT', boothNumber: 'B1', createdAt: new Date().toISOString(), _count: { assessments: 11 } },
    { id: '4', teamName: 'HealthAlert System', boothNumber: 'B2', createdAt: new Date().toISOString(), _count: { assessments: 14 } },
    { id: '5', teamName: 'AgriSense Platform', boothNumber: 'C1', createdAt: new Date().toISOString(), _count: { assessments: 9 } },
    { id: '6', teamName: 'SmartParking Pro', boothNumber: 'C2', createdAt: new Date().toISOString(), _count: { assessments: 9 } },
]

const BOOTH_COLOR: Record<string, string> = {
    A: '#4F8EF7', B: '#6366f1', C: '#0891b2', D: '#16a34a', E: '#d97706', F: '#dc2626'
}
const bc = (b: string) => BOOTH_COLOR[b?.charAt(0).toUpperCase()] ?? '#64748b'

const fetchTeams = () => api.get<TeamData[]>('/admin/teams').then(r => r.data).catch(() => MOCK)

// ─── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(13,27,75,0.45)', backdropFilter: 'blur(4px)' }}>
            <div className="card w-full max-w-md" style={{ background: 'var(--card-bg)' }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <h3 className="font-bold text-display" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    )
}

function ConfirmModal({ name, onConfirm, onClose, loading }: { name: string; onConfirm: () => void; onClose: () => void; loading: boolean }) {
    return (
        <Modal title="Hapus Tim" onClose={onClose}>
            <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: '#FEF2F2' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Hapus <span className="text-red-600">"{name}"</span>?</p>
                <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Semua data penilaian tim ini akan ikut terhapus dan tidak bisa dikembalikan.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ border: '2px solid var(--card-border)', color: 'var(--text-primary)' }}>
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{ background: '#DC2626', opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

// ─── Form Modal (Add / Edit) ─────────────────────────────────────────────────
function TeamFormModal({
    mode, initial, onClose, onSubmit, loading, error,
}: {
    mode: 'add' | 'edit'
    initial?: TeamData
    onClose: () => void
    onSubmit: (f: TeamForm) => void
    loading: boolean
    error: string
}) {
    const [form, setForm] = useState<TeamForm>({
        teamName: initial?.teamName ?? '',
        boothNumber: initial?.boothNumber ?? '',
        password: '',
    })

    const set = (k: keyof TeamForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    const inputStyle = {
        border: '2px solid var(--card-border)',
        background: 'var(--body-bg)',
        color: 'var(--text-primary)',
        borderRadius: 12,
        padding: '10px 14px',
        fontSize: 14,
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.15s',
    }

    return (
        <Modal title={mode === 'add' ? 'Tambah Tim Baru' : 'Edit Tim'} onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Nama Tim</label>
                    <input value={form.teamName} onChange={set('teamName')} placeholder="Contoh: SmartFarm IoT"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Nomor Stand</label>
                    <input value={form.boothNumber} onChange={set('boothNumber')} placeholder="Contoh: A1, B2, C1"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Huruf kapital + nomor, misal: A1, B2</p>
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        Password {mode === 'edit' && <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(kosongkan jika tidak diubah)</span>}
                    </label>
                    <input type="password" value={form.password} onChange={set('password')}
                        placeholder={mode === 'add' ? 'Password untuk login kiosk' : '••••••••'}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>

                {error && (
                    <div className="text-xs px-4 py-3 rounded-xl" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        {error}
                    </div>
                )}

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                        style={{ border: '2px solid var(--card-border)', color: 'var(--text-primary)' }}>
                        Batal
                    </button>
                    <button
                        onClick={() => onSubmit(form)}
                        disabled={loading || !form.teamName || !form.boothNumber || (mode === 'add' && !form.password)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Menyimpan...' : mode === 'add' ? 'Tambah Tim' : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function TeamsPage() {
    const qc = useQueryClient()
    const { data: teams = MOCK } = useQuery({ queryKey: ['admin-teams'], queryFn: fetchTeams, placeholderData: MOCK })

    const [search, setSearch] = useState('')
    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
    const [editTarget, setEditTarget] = useState<TeamData | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<TeamData | null>(null)
    const [mutError, setMutError] = useState('')

    const filtered = useMemo(() =>
        teams.filter(t =>
            (t.teamName ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (t.boothNumber ?? '').toLowerCase().includes(search.toLowerCase())
        ), [teams, search])

    const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-teams'] })

    // Add
    const addMut = useMutation({
        mutationFn: (f: TeamForm) => api.post('/admin/teams', f).then(r => r.data),
        onSuccess: () => { invalidate(); setModalMode(null); setMutError('') },
        onError: (e: unknown) => setMutError((e as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Gagal menambah tim.'),
    })

    // Edit
    const editMut = useMutation({
        mutationFn: (f: TeamForm) => api.put(`/admin/teams/${editTarget!.id}`, f).then(r => r.data),
        onSuccess: () => { invalidate(); setModalMode(null); setMutError('') },
        onError: (e: unknown) => setMutError((e as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Gagal mengubah tim.'),
    })

    // Delete
    const deleteMut = useMutation({
        mutationFn: () => api.delete(`/admin/teams/${deleteTarget!.id}`),
        onSuccess: () => { invalidate(); setDeleteTarget(null) },
        onError: () => setDeleteTarget(null),
    })

    const openAdd = () => { setMutError(''); setModalMode('add') }
    const openEdit = (t: TeamData) => { setMutError(''); setEditTarget(t); setModalMode('edit') }
    const closeModal = () => { setModalMode(null); setEditTarget(null) }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ color: 'var(--text-secondary)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder="Cari nama tim atau nomor stand..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                        style={{ border: '2px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', width: 280 }}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-2 rounded-xl"
                        style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                        {filtered.length} tim
                    </span>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Tambah Tim
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(team => {
                    const color = bc(team.boothNumber)
                    const assessCount = team._count?.assessments ?? 0
                    return (
                        <div key={team.id} className="card p-5 duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-black text-display shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                                        {team.boothNumber}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{team.teamName}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Stand {team.boothNumber}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                                    style={{ background: assessCount > 0 ? '#DCFCE7' : '#FEF3C7', color: assessCount > 0 ? '#15803d' : '#92400e' }}>
                                    {assessCount > 0 ? 'Aktif' : 'Belum dinilai'}
                                </span>
                            </div>

                            <div style={{ height: 1, background: 'var(--card-border)', marginBottom: 14 }} />

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--body-bg)' }}>
                                    <p className="text-lg font-black text-display" style={{ color }}>{assessCount}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Penilaian</p>
                                </div>
                                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--body-bg)' }}>
                                    <p className="text-lg font-black text-display" style={{ color: 'var(--text-primary)' }}>
                                        {new Date(team.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Terdaftar</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(team)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                                    style={{ border: '2px solid var(--card-border)', color: 'var(--text-primary)' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--zetech-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--zetech-accent)' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                                <button onClick={() => setDeleteTarget(team)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                                    style={{ border: '2px solid #FEE2E2', color: '#DC2626', background: '#FEF2F2' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEE2E2' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2' }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    )
                })}

                {filtered.length === 0 && (
                    <div className="col-span-3 py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="mx-auto mb-3 opacity-40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="text-sm">Tidak ada tim yang cocok.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modalMode === 'add' && (
                <TeamFormModal mode="add" onClose={closeModal}
                    onSubmit={f => addMut.mutate(f)}
                    loading={addMut.isPending} error={mutError} />
            )}
            {modalMode === 'edit' && editTarget && (
                <TeamFormModal mode="edit" initial={editTarget} onClose={closeModal}
                    onSubmit={f => editMut.mutate(f)}
                    loading={editMut.isPending} error={mutError} />
            )}
            {deleteTarget && (
                <ConfirmModal name={deleteTarget.teamName}
                    onConfirm={() => deleteMut.mutate()}
                    onClose={() => setDeleteTarget(null)}
                    loading={deleteMut.isPending} />
            )}
        </div>
    )
}