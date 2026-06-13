// src/features/admin/RecapPage.tsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/config/api'

interface RecapEntry {
    teamId: string
    teamName: string
    boothNumber: string
    totalVotes: number
    assessorCount: number
    avgPoster: number   // rata-rata nilai POSTER dari dosen
    avgProduct: number   // rata-rata nilai PRODUCT dari dosen
    avgTotalScore: number   // rata-rata (poster+product)/2
}

const MOCK: RecapEntry[] = [
    { teamId: '1', teamName: 'HealthAlert System', boothNumber: 'B2', totalVotes: 9, assessorCount: 5, avgPoster: 90.6, avgProduct: 90.0, avgTotalScore: 90.3 },
    { teamId: '2', teamName: 'EduBot Learning', boothNumber: 'A2', totalVotes: 15, assessorCount: 5, avgPoster: 91.2, avgProduct: 88.8, avgTotalScore: 90.0 },
    { teamId: '3', teamName: 'Aqua Smart Monitor', boothNumber: 'A1', totalVotes: 12, assessorCount: 5, avgPoster: 87.2, avgProduct: 90.2, avgTotalScore: 85.0 },
    { teamId: '4', teamName: 'SmartParking Pro', boothNumber: 'C2', totalVotes: 4, assessorCount: 5, avgPoster: 82.8, avgProduct: 84.6, avgTotalScore: 83.7 },
    { teamId: '5', teamName: 'WasteTrack IoT', boothNumber: 'B1', totalVotes: 6, assessorCount: 5, avgPoster: 75.2, avgProduct: 76.8, avgTotalScore: 77.0 },
    { teamId: '6', teamName: 'AgriSense Platform', boothNumber: 'C1', totalVotes: 4, assessorCount: 5, avgPoster: 70.0, avgProduct: 74.0, avgTotalScore: 72.0 },
]

const fetchRecap = () =>
    api.get<RecapEntry[]>('/admin/recap').then(r => r.data).catch(() => MOCK)

type SortKey = 'boothNumber' | 'teamName' | 'totalVotes' | 'assessorCount' | 'avgPoster' | 'avgProduct' | 'avgTotalScore'
type SortDir = 'asc' | 'desc'

function getRankBadge(rank: number) {
    if (rank === 1) return { emoji: '🥇', style: { background: '#FEF3C7', color: '#92400E' } }
    if (rank === 2) return { emoji: '🥈', style: { background: '#F3F4F6', color: '#374151' } }
    if (rank === 3) return { emoji: '🥉', style: { background: '#FEE2E2', color: '#9A3412' } }
    return { emoji: null, style: {} }
}

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
    const pct = Math.min(((value ?? 0) / max) * 100, 100)
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-16 rounded-full h-1.5 overflow-hidden shrink-0" style={{ background: 'var(--card-border)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                {(value ?? 0).toFixed(1)}
            </span>
        </div>
    )
}

function ScoreBar({ value }: { value: number }) {
    const pct = Math.min(((value ?? 0) / 100) * 100, 100)
    const color = pct >= 85 ? '#16a34a' : pct >= 70 ? '#4F8EF7' : '#f59e0b'
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: 'var(--card-border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-sm font-mono font-bold w-10 text-right" style={{ color: 'var(--text-primary)' }}>
                {(value ?? 0).toFixed(1)}
            </span>
        </div>
    )
}

export default function RecapPage() {
    const { data: recap = MOCK } = useQuery({
        queryKey: ['admin-recap'],
        queryFn: fetchRecap,
        placeholderData: MOCK,
        refetchInterval: 30_000,   // auto-refresh tiap 30 detik
    })

    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('avgTotalScore')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    const sorted = useMemo(() => {
        const filtered = (recap ?? MOCK).filter(t =>
            (t.teamName ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (t.boothNumber ?? '').toLowerCase().includes(search.toLowerCase())
        )
        return [...filtered].sort((a, b) => {
            const av = a[sortKey] as number | string
            const bv = b[sortKey] as number | string
            const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
            return sortDir === 'asc' ? cmp : -cmp
        })
    }, [recap, search, sortKey, sortDir])

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('desc') }
    }

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <span style={{ opacity: 0.3 }}>↕</span>
        return <span style={{ color: 'var(--zetech-accent)' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
    }

    return (
        <div className="space-y-5">

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                {/* Poster avg */}
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: '#EEF3FF' }}>🖼️</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Avg Nilai Poster</p>
                            <p className="text-xl font-black text-display" style={{ color: 'var(--zetech-blue)' }}>
                                {recap.length
                                    ? (recap.reduce((s, r) => s + (r.avgPoster ?? 0), 0) / recap.length).toFixed(1)
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Product avg */}
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: '#F0FDF4' }}>💡</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Avg Nilai Product</p>
                            <p className="text-xl font-black text-display" style={{ color: '#16a34a' }}>
                                {recap.length
                                    ? (recap.reduce((s, r) => s + (r.avgProduct ?? 0), 0) / recap.length).toFixed(1)
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Total votes */}
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: '#F5F3FF' }}>🗳️</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Total Vote Mahasiswa</p>
                            <p className="text-xl font-black text-display" style={{ color: '#6366f1' }}>
                                {recap.reduce((s, r) => s + (r.totalVotes ?? 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table header */}
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
                <div className="flex gap-2">
                    <span className="text-xs font-semibold px-3 py-2 rounded-xl"
                        style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                        {sorted.length} tim
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--text-secondary)' }}>Rank</th>

                                {([
                                    ['boothNumber', 'Stand'],
                                    ['teamName', 'Nama Tim'],
                                    ['assessorCount', 'Penilai'],
                                    ['totalVotes', 'Vote'],
                                    ['avgPoster', '🖼️ Poster'],
                                    ['avgProduct', '💡 Product'],
                                    ['avgTotalScore', 'Nilai Akhir'],
                                ] as [SortKey, string][]).map(([key, label]) => (
                                    <th key={key}
                                        className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                                        style={{ color: 'var(--text-secondary)' }}
                                        onClick={() => toggleSort(key)}>
                                        <span className="flex items-center gap-1.5">{label} <SortIcon k={key} /></span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((entry, idx) => {
                                const rank = idx + 1
                                const badge = getRankBadge(rank)
                                return (
                                    <tr key={entry.teamId}
                                        style={{ borderBottom: '1px solid var(--card-border)' }}
                                        className="transition-colors hover:bg-blue-50/30">

                                        {/* Rank */}
                                        <td className="px-4 py-4">
                                            {badge.emoji ? (
                                                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg w-fit" style={badge.style}>
                                                    {badge.emoji} #{rank}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>#{rank}</span>
                                            )}
                                        </td>

                                        {/* Stand */}
                                        <td className="px-4 py-4">
                                            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
                                                style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                                                {entry.boothNumber}
                                            </span>
                                        </td>

                                        {/* Name */}
                                        <td className="px-4 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {entry.teamName}
                                        </td>

                                        {/* Assessor */}
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: '#EEF3FF', color: 'var(--zetech-blue)' }}>
                                                {entry.assessorCount} dosen
                                            </span>
                                        </td>

                                        {/* Votes */}
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: 'rgba(99,102,241,0.1)', color: '#4338ca' }}>
                                                🗳 {entry.totalVotes}
                                            </span>
                                        </td>

                                        {/* Poster */}
                                        <td className="px-4 py-4 min-w-32">
                                            <MiniBar value={entry.avgPoster} color="#4F8EF7" />
                                        </td>

                                        {/* Product */}
                                        <td className="px-4 py-4 min-w-32">
                                            <MiniBar value={entry.avgProduct} color="#16a34a" />
                                        </td>

                                        {/* Final score */}
                                        <td className="px-4 py-4 min-w-45">
                                            <ScoreBar value={entry.avgTotalScore} />
                                        </td>
                                    </tr>
                                )
                            })}

                            {sorted.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Tidak ada tim yang cocok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 flex justify-between items-center"
                    style={{ borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {sorted.length} dari {(recap ?? MOCK).length} tim
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Klik header kolom untuk mengurutkan</p>
                </div>
            </div>
        </div>
    )
}