import { useQuery } from '@tanstack/react-query'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts'
import StatCard from './components/StatCard'
import api from '@/config/api'
import type { DashboardStats } from '@/types'

// ─── Local types ─────────────────────────────────────────────────────────────
interface BarEntry { name: string; score: number; votes: number }

// ─── Mock data (diganti hit API saat BE ready) ──────────────────────────────
const MOCK_STATS: DashboardStats = {
    totalTeams: 12,
    totalVotes: 148,
    totalJudges: 24,
    averageScore: 78.4,
}

const MOCK_BAR: BarEntry[] = [
    { name: 'A', score: 85, votes: 18 },
    { name: 'B', score: 72, votes: 14 },
    { name: 'C', score: 91, votes: 22 },
    { name: 'D', score: 68, votes: 10 },
    { name: 'E', score: 79, votes: 16 },
    { name: 'F', score: 88, votes: 20 },
    { name: 'G', score: 75, votes: 12 },
    { name: 'H', score: 83, votes: 17 },
]

const MOCK_PIE = [
    { name: 'Mahasiswa', value: 95, color: '#4F8EF7' },
    { name: 'Dosen', value: 53, color: '#1B3FA0' },
]

// ─── Fetchers ────────────────────────────────────────────────────────────────
const fetchStats = () => api.get<DashboardStats>('/admin/stats').then(r => r.data)
const fetchScores = () => api.get<BarEntry[]>('/admin/scores/bar').then(r => r.data)

export default function DashboardPage() {
    const stats = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchStats, placeholderData: MOCK_STATS })
    const scores = useQuery({ queryKey: ['dashboard-scores'], queryFn: fetchScores, placeholderData: MOCK_BAR })

    const s = stats.data ?? MOCK_STATS
    const b = scores.data ?? MOCK_BAR

    return (
        <div className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    label="Total Tim"
                    value={s.totalTeams}
                    sub="Peserta terdaftar"
                    color="#1B3FA0,#4F8EF7"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                />
                <StatCard
                    label="Total Vote"
                    value={s.totalVotes}
                    sub="Suara masuk"
                    color="#6366f1,#a78bfa"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>}
                />
                <StatCard
                    label="Dosen Juri"
                    value={s.totalJudges}
                    sub="Sudah menilai"
                    color="#0891b2,#22d3ee"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                />
                <StatCard
                    label="Rata-rata Nilai"
                    value={s.averageScore.toFixed(1)}
                    sub="Dari semua kategori"
                    color="#16a34a,#4ade80"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* Bar chart */}
                <div className="card p-5 xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>Perolehan Nilai per Stand</h3>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Rata-rata nilai dosen (Inovasi + Presentasi + Teknis)</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                            Dosen
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={b} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}
                                labelStyle={{ fontWeight: 600, color: 'var(--text-primary)' }}
                            />
                            <Bar dataKey="score" name="Nilai" radius={[6, 6, 0, 0]}
                                fill="url(#barGrad)" />
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F8EF7" />
                                    <stop offset="100%" stopColor="#1B3FA0" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="card p-5">
                    <div className="mb-4">
                        <h3 className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>Distribusi Vote</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Mahasiswa vs Dosen</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={MOCK_PIE}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {MOCK_PIE.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend
                                formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: '1px solid var(--card-border)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center label */}
                    <p className="text-center text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Total: <strong style={{ color: 'var(--text-primary)' }}>{MOCK_PIE.reduce((a, b) => a + b.value, 0)}</strong> vote
                    </p>
                </div>
            </div>

            {/* Vote per stand bar */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-display" style={{ color: 'var(--text-primary)' }}>Vote Mahasiswa per Stand</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Jumlah suara mahasiswa yang masuk per tim</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={b} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--card-border)' }} />
                        <Bar dataKey="votes" name="Vote" radius={[6, 6, 0, 0]} fill="#a78bfa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}