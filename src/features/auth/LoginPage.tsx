import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import api from '@/config/api'

export default function LoginPage() {
    const navigate = useNavigate()
    const { setAuth } = useAuthStore()

    const [form, setForm] = useState({ identifier: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { data } = await api.post('/auth/login/admin', {
                id: form.identifier, password: form.password,
            })
            setAuth({ id: data.user.id, name: data.user.name, role: 'admin' }, data.token)
            navigate('/admin/dashboard')
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
            setError(msg || 'Login gagal. Periksa kembali ID dan password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--body-bg)' }}>
            {/* Left panel — branding */}
            <div className="hidden lg:flex flex-col justify-between w-120 shrink-0 p-10 relative overflow-hidden"
                style={{ background: 'var(--sidebar-bg)' }}>
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, var(--zetech-accent), transparent)' }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-display"
                        style={{ background: 'linear-gradient(135deg, var(--zetech-accent), #6366f1)' }}>ZS</div>
                    <div>
                        <p className="text-white font-semibold text-display">ZeScore</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>by Zetech</p>
                    </div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-display leading-tight mb-4" style={{ color: 'white' }}>
                        Smart Kiosk<br />
                        <span style={{ color: 'var(--zetech-accent)' }}>Evaluation</span><br />
                        System
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Panel admin untuk mengelola tim, peserta, dan rekapitulasi nilai PT3 Expo.
                    </p>
                </div>

                <div className="relative z-10 flex gap-2 flex-wrap">
                    {['Validasi NIM/NIDN', 'Anti Double Vote', 'Real-time Recap'].map(t => (
                        <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium"
                            style={{ background: 'rgba(79,142,247,0.15)', color: 'var(--zetech-accent)' }}>{t}</span>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm text-display"
                            style={{ background: 'linear-gradient(135deg, var(--zetech-accent), #6366f1)' }}>ZS</div>
                        <span className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>ZeScore</span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                            👑 Admin Panel
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-display mb-1" style={{ color: 'var(--text-primary)' }}>
                        Selamat datang 👋
                    </h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                        Masuk untuk mengakses dashboard admin.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                                ID Admin
                            </label>
                            <input type="text"
                                placeholder="Masukkan ID admin..."
                                value={form.identifier}
                                onChange={e => setForm({ ...form, identifier: e.target.value })}
                                required autoFocus
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{ border: '2px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                                onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                                onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
                            <input type="password" placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{ border: '2px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                                onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                                onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-xs px-4 py-3 rounded-xl" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Memverifikasi...
                                </span>
                            ) : 'Masuk sebagai Admin'}
                        </button>
                    </form>

                    <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
                        ZeScore · PT3 Expo · Zetech Ecosystem
                    </p>
                </div>
            </div>
        </div>
    )
}
