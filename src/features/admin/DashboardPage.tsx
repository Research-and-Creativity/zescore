// src/features/admin/DashboardPage.tsx
import { useQuery } from '@tanstack/react-query'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import StatCard from './components/StatCard'
import api from '@/config/api'

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
    totalTeams: number
    totalVoters: number
    totalAssessors: number
    avgScoreAll: number
}
interface BarEntry {
    name: string
    score: number
    votes: number
}

// ─── Fallback mock (hanya tampil saat BE belum ready) ─────────────────────────
const MOCK_STATS: DashboardStats = { totalTeams: 0, totalVoters: 0, totalAssessors: 0, avgScoreAll: 0 }
const MOCK_BAR: BarEntry[] = []

// ─── Fetchers ─────────────────────────────────────────────────────────────────
const fetchStats = () => api.get<DashboardStats>('/admin/stats').then(r => r.data).catch(() => MOCK_STATS)
const fetchScores = () => api.get<BarEntry[]>('/admin/scores/bar').then(r => r.data).catch(() => MOCK_BAR)

// ─── Pie data — dihitung dari stats ──────────────────────────────────────────
const PIE_COLORS = ['#4F8EF7', '#1B3FA0']

export default function DashboardPage() {
    const { data: stats = MOCK_STATS, isLoading: loadingStats } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchStats,
        placeholderData: MOCK_STATS,
        refetchInterval: 30_000,
    })

    const { data: barData = MOCK_BAR, isLoading: loadingBar } = useQuery({
        queryKey: ['dashboard-scores'],
        queryFn: fetchScores,
        placeholderData: MOCK_BAR,
        refetchInterval: 30_000,
    })

    const s = stats ?? MOCK_STATS
    const b = barData ?? MOCK_BAR

    // Pie chart dari data aktual
    const pieData = [
        { name: 'Vote Mahasiswa', value: s.totalVoters },
        { name: 'Penilaian Dosen', value: s.totalAssessors },
    ].filter(d => d.value > 0)

    const isEmpty = b.length === 0

    return (
        <div className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    label="Total Tim"
                    value={loadingStats ? '—' : s.totalTeams}
                    sub="Tim terdaftar"
                    color="#1B3FA0,#4F8EF7"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                />
                <StatCard
                    label="Vote Mahasiswa"
                    value={loadingStats ? '—' : s.totalVoters}
                    sub="Suara masuk"
                    color="#6366f1,#a78bfa"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
                />
                <StatCard
                    label="Dosen Juri Aktif"
                    value={loadingStats ? '—' : s.totalAssessors}
                    sub="Sudah menilai"
                    color="#0891b2,#22d3ee"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                />
                <StatCard
                    label="Rata-rata Nilai"
                    value={loadingStats ? '—' : (s.avgScoreAll ?? 0).toFixed(1)}
                    sub="Seluruh penilaian dosen"
                    color="#16a34a,#4ade80"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* Bar chart nilai */}
                <div className="card p-5 xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>
                                Rata-rata Nilai per Stand
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                Rata-rata totalScore dari penilaian dosen
                            </p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                            Dosen
                        </span>
                    </div>

                    {loadingBar ? (
                        <div className="h-60 flex items-center justify-center">
                            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--zetech-accent)' }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        </div>
                    ) : isEmpty ? (
                        <div className="h-60 flex flex-col items-center justify-center gap-2"
                            style={{ color: 'var(--text-secondary)' }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.4}>
                                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            <p className="text-sm">Belum ada data penilaian</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={b} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: '1px solid var(--card-border)'}}
                                    labelStyle={{ fontWeight: 600, color: 'var(--text-primary)' }}
                                    formatter={(val) => [typeof val === 'number' ? `${val.toFixed(1)}` : '—', 'Nilai']}
                                />
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4F8EF7" />
                                        <stop offset="100%" stopColor="#1B3FA0" />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="score" name="Nilai" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Pie chart */}
                <div className="card p-5">
                    <div className="mb-4">
                        <h3 className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>
                            Distribusi Partisipasi
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            Vote Mahasiswa vs Penilaian Dosen
                        </p>
                    </div>

                    {loadingStats ? (
                        <div className="h-48 flex items-center justify-center">
                            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--zetech-accent)' }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        </div>
                    ) : pieData.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center gap-2"
                            style={{ color: 'var(--text-secondary)' }}>
                            <p className="text-sm">Belum ada data</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={80}
                                    paddingAngle={3} dataKey="value">
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend formatter={(v) => <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{v}</span>} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--card-border)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}

                    <p className="text-center text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Total:{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>
                            {s.totalVoters + s.totalAssessors}
                        </strong>{' '}
                        partisipasi
                    </p>
                </div>
            </div>

            {/* Vote per stand */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>
                            Vote Mahasiswa per Stand
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            Jumlah suara mahasiswa yang masuk per tim
                        </p>
                    </div>
                </div>

                {loadingBar ? (
                    <div className="h-44 flex items-center justify-center">
                        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--zetech-accent)' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                ) : isEmpty ? (
                    <div className="h-44 flex flex-col items-center justify-center gap-2"
                        style={{ color: 'var(--text-secondary)' }}>
                        <p className="text-sm">Belum ada vote masuk</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={b} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: '1px solid var(--card-border)' }}
                                formatter={(val) => [typeof val === 'number' ? val : '—', 'Vote']}
                            />
                            <Bar dataKey="votes" name="Vote" radius={[6, 6, 0, 0]} fill="#a78bfa" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div>
    )
}