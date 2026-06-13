// src/features/admin/UsersPage.tsx
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/config/api'

interface UserData {
    id: string
    name: string
    role: 'STUDENT' | 'LECTURER'
    createdAt: string
    _count: { assessments: number }
}
interface UserForm { id: string; name: string; role: 'STUDENT' | 'LECTURER'; password: string }

const MOCK: UserData[] = [
    { id: '103122400001', name: 'Andi Firmansyah', role: 'STUDENT', createdAt: new Date().toISOString(), _count: { assessments: 3 } },
    { id: '103122400002', name: 'Bella Nurhaliza', role: 'STUDENT', createdAt: new Date().toISOString(), _count: { assessments: 1 } },
    { id: '103122400003', name: 'Cahya Ramadhan', role: 'STUDENT', createdAt: new Date().toISOString(), _count: { assessments: 2 } },
    { id: '2085001001', name: 'Dr. Hendra Saputra', role: 'LECTURER', createdAt: new Date().toISOString(), _count: { assessments: 6 } },
    { id: '2085001002', name: 'Dr. Sri Wahyuni', role: 'LECTURER', createdAt: new Date().toISOString(), _count: { assessments: 4 } },
]

const fetchUsers = () => api.get<UserData[]>('/admin/users').then(r => r.data).catch(() => MOCK)

type TabType = 'ALL' | 'STUDENT' | 'LECTURER'

// ─── Modal shared ────────────────────────────────────────────────────────────
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
        <Modal title="Hapus User" onClose={onClose}>
            <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF2F2' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Hapus <span className="text-red-600">"{name}"</span>?</p>
                <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Semua riwayat penilaian user ini juga akan terhapus.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                        style={{ border: '2px solid var(--card-border)', color: 'var(--text-primary)' }}>Batal</button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                        style={{ background: '#DC2626', opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

function UserFormModal({ mode, initial, onClose, onSubmit, loading, error }: {
    mode: 'add' | 'edit'; initial?: UserData
    onClose: () => void; onSubmit: (f: UserForm) => void
    loading: boolean; error: string
}) {
    const [form, setForm] = useState<UserForm>({
        id: initial?.id ?? '',
        name: initial?.name ?? '',
        role: initial?.role ?? 'STUDENT',
        password: '',
    })
    const set = (k: keyof UserForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    const inputCls = {
        border: '2px solid var(--card-border)', background: 'var(--body-bg)',
        color: 'var(--text-primary)', borderRadius: 12, padding: '10px 14px',
        fontSize: 14, width: '100%', outline: 'none', transition: 'border-color 0.15s',
    }

    const idHint = form.role === 'STUDENT'
        ? 'NIM mahasiswa (12 digit), contoh: 103122400013'
        : 'NIDN dosen (10 digit), contoh: 2085001234'

    return (
        <Modal title={mode === 'add' ? 'Tambah User' : 'Edit User'} onClose={onClose}>
            <div className="space-y-4">
                {/* Role selector */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Role</label>
                    <div className="flex rounded-xl p-1" style={{ background: 'var(--card-border)' }}>
                        {(['STUDENT', 'LECTURER'] as const).map(r => (
                            <button key={r} type="button"
                                onClick={() => setForm(f => ({ ...f, role: r }))}
                                disabled={mode === 'edit'}
                                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                                style={form.role === r
                                    ? { background: 'var(--card-bg)', color: 'var(--zetech-blue)' }
                                    : { color: 'var(--text-secondary)' }}>
                                {r === 'STUDENT' ? '🎓 Mahasiswa' : '👨‍🏫 Dosen'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ID */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        {form.role === 'STUDENT' ? 'NIM' : 'NIDN'}
                    </label>
                    <input value={form.id} onChange={set('id')} placeholder={idHint}
                        disabled={mode === 'edit'} style={{ ...inputCls, opacity: mode === 'edit' ? 0.6 : 1 }}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                    {mode === 'add' && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{idHint}</p>}
                </div>

                {/* Name */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Nama Lengkap</label>
                    <input value={form.name} onChange={set('name')} placeholder="Nama lengkap"
                        style={inputCls}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>

                {/* Password — optional */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        Password{' '}
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                            {mode === 'edit' ? '(kosongkan jika tidak diubah)' : '(opsional)'}
                        </span>
                    </label>
                    <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••"
                        style={inputCls}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>

                {error && <div className="text-xs px-4 py-3 rounded-xl" style={{ background: '#FEF2F2', color: '#DC2626' }}>{error}</div>}

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                        style={{ border: '2px solid var(--card-border)', color: 'var(--text-primary)' }}>Batal</button>
                    <button onClick={() => onSubmit(form)}
                        disabled={loading || !form.id || !form.name}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Menyimpan...' : mode === 'add' ? 'Tambah User' : 'Simpan'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function UsersPage() {
    const qc = useQueryClient()
    const { data: users = MOCK } = useQuery({ queryKey: ['admin-users'], queryFn: fetchUsers, placeholderData: MOCK })

    const [tab, setTab] = useState<TabType>('ALL')
    const [search, setSearch] = useState('')
    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
    const [editTarget, setEditTarget] = useState<UserData | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null)
    const [mutError, setMutError] = useState('')

    const filtered = useMemo(() =>
        users.filter(u => {
            const matchTab = tab === 'ALL' || u.role === tab
            const matchSearch =
                (u.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
                (u.id ?? '').toLowerCase().includes(search.toLowerCase())
            return matchTab && matchSearch
        }), [users, tab, search])

    const students = users.filter(u => u.role === 'STUDENT').length
    const lecturers = users.filter(u => u.role === 'LECTURER').length

    const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-users'] })

    const addMut = useMutation({
        mutationFn: (f: UserForm) => api.post('/admin/users', { id: f.id, name: f.name, role: f.role, password: f.password || undefined }).then(r => r.data),
        onSuccess: () => { invalidate(); setModalMode(null); setMutError('') },
        onError: (e: unknown) => setMutError((e as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Gagal menambah user.'),
    })
    const editMut = useMutation({
        mutationFn: (f: UserForm) => api.put(`/admin/users/${editTarget!.id}`, { name: f.name, password: f.password || undefined }).then(r => r.data),
        onSuccess: () => { invalidate(); setModalMode(null); setMutError('') },
        onError: (e: unknown) => setMutError((e as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Gagal mengubah user.'),
    })
    const deleteMut = useMutation({
        mutationFn: () => api.delete(`/admin/users/${deleteTarget!.id}`),
        onSuccess: () => { invalidate(); setDeleteTarget(null) },
        onError: () => setDeleteTarget(null),
    })

    const ROLE_COLOR = { STUDENT: { bg: '#EEF3FF', text: '#1B3FA0' }, LECTURER: { bg: '#F0FDF4', text: '#15803d' } }

    return (
        <div className="space-y-5">

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                {([
                    ['ALL', 'Total User', users.length, '#4F8EF7,#6366f1'],
                    ['STUDENT', 'Mahasiswa', students, '#1B3FA0,#4F8EF7'],
                    ['LECTURER', 'Dosen', lecturers, '#0891b2,#22d3ee'],
                ] as [TabType, string, number, string][]).map(([t, label, count, grad]) => (
                    <button key={t} onClick={() => setTab(t)}
                        className="card p-4 text-left transition-all"
                        style={{ outline: tab === t ? `2px solid var(--zetech-accent)` : 'none' }}>
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                        <p className="text-2xl font-black text-display"
                            style={{ background: `linear-gradient(135deg, ${grad})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {count}
                        </p>
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ color: 'var(--text-secondary)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder="Cari nama atau NIM/NIDN..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                        style={{ border: '2px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', width: 260 }}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>
                <button onClick={() => { setMutError(''); setModalMode('add') }}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg, var(--zetech-blue), var(--zetech-accent))' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tambah User
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
                                {['NIM / NIDN', 'Nama', 'Role', 'Penilaian', 'Terdaftar', 'Aksi'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: 'var(--text-secondary)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => {
                                const rc = ROLE_COLOR[user.role]
                                return (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--card-border)' }}
                                        className="transition-colors hover:bg-blue-50/30">
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-mono font-semibold px-2 py-1 rounded-lg"
                                                style={{ background: 'var(--body-bg)', color: 'var(--text-primary)' }}>
                                                {user.id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: rc.bg, color: rc.text }}>
                                                {user.role === 'STUDENT' ? '🎓 Mahasiswa' : '👨‍🏫 Dosen'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                {user._count?.assessments ?? 0}x
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setMutError(''); setEditTarget(user); setModalMode('edit') }}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                                                    style={{ border: '1.5px solid var(--card-border)', color: 'var(--text-primary)' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--zetech-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--zetech-accent)' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => setDeleteTarget(user)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                                                    style={{ border: '1.5px solid #FEE2E2', color: '#DC2626', background: '#FEF2F2' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEE2E2' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2' }}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Tidak ada user yang cocok.
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3" style={{ borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{filtered.length} dari {users.length} user</p>
                </div>
            </div>

            {/* Modals */}
            {modalMode === 'add' && (
                <UserFormModal mode="add" onClose={() => setModalMode(null)}
                    onSubmit={f => addMut.mutate(f)} loading={addMut.isPending} error={mutError} />
            )}
            {modalMode === 'edit' && editTarget && (
                <UserFormModal mode="edit" initial={editTarget} onClose={() => { setModalMode(null); setEditTarget(null) }}
                    onSubmit={f => editMut.mutate(f)} loading={editMut.isPending} error={mutError} />
            )}
            {deleteTarget && (
                <ConfirmModal name={deleteTarget.name} onConfirm={() => deleteMut.mutate()}
                    onClose={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
            )}
        </div>
    )
}