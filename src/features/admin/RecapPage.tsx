import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/config/api'
import type { Team } from '@/types'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_TEAMS: Team[] = [
    { id: '1', name: 'SmartFarm IoT', standNumber: 1, totalScore: 91.2, voteCount: 22 },
    { id: '2', name: 'EduBot AI', standNumber: 2, totalScore: 85.5, voteCount: 18 },
    { id: '3', name: 'MedTrack App', standNumber: 3, totalScore: 79.8, voteCount: 14 },
    { id: '4', name: 'GreenEnergy Sys', standNumber: 4, totalScore: 88.3, voteCount: 20 },
    { id: '5', name: 'UrbanMobility', standNumber: 5, totalScore: 72.4, voteCount: 10 },
    { id: '6', name: 'CloudSec Platform', standNumber: 6, totalScore: 83.7, voteCount: 17 },
    { id: '7', name: 'AquaMonitor', standNumber: 7, totalScore: 76.1, voteCount: 12 },
    { id: '8', name: 'TravelBuddy AR', standNumber: 8, totalScore: 68.9, voteCount: 9 },
    { id: '9', name: 'FoodSafe Detect', standNumber: 9, totalScore: 80.0, voteCount: 15 },
    { id: '10', name: 'FinLite Mobile', standNumber: 10, totalScore: 74.5, voteCount: 11 },
    { id: '11', name: 'WasteSort AI', standNumber: 11, totalScore: 87.6, voteCount: 19 },
    { id: '12', name: 'SafeRoute Nav', standNumber: 12, totalScore: 70.2, voteCount: 8 },
]

type SortKey = 'standNumber' | 'name' | 'totalScore' | 'voteCount'
type SortDir = 'asc' | 'desc'

const fetchTeams = () => api.get<Team[]>('/admin/recap').then(r => r.data)

function getRankBadge(rank: number) {
    if (rank === 1) return { emoji: '🥇', style: { background: '#FEF3C7', color: '#92400E' } }
    if (rank === 2) return { emoji: '🥈', style: { background: '#F3F4F6', color: '#374151' } }
    if (rank === 3) return { emoji: '🥉', style: { background: '#FEE2E2', color: '#9A3412' } }
    return { emoji: null, style: {} }
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
    const pct = Math.min((value / max) * 100, 100)
    const color = pct >= 85 ? '#16a34a' : pct >= 70 ? '#4F8EF7' : '#f59e0b'
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: 'var(--card-border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-xs font-mono font-semibold w-10 text-right" style={{ color: 'var(--text-primary)' }}>
                {value.toFixed(1)}
            </span>
        </div>
    )
}

export default function RecapPage() {
    const { data: rawTeams } = useQuery({ queryKey: ['recap-teams'], queryFn: fetchTeams, placeholderData: MOCK_TEAMS })
    const teams = rawTeams ?? MOCK_TEAMS

    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('totalScore')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    const sorted = useMemo(() => {
        const filtered = teams.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            String(t.standNumber).includes(search)
        )
        return [...filtered].sort((a, b) => {
            const av = a[sortKey] as number | string
            const bv = b[sortKey] as number | string
            const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
            return sortDir === 'asc' ? cmp : -cmp
        })
    }, [teams, search, sortKey, sortDir])

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('desc') }
    }

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <span style={{ opacity: 0.3 }}>↕</span>
        return <span style={{ color: 'var(--zetech-accent)' }}>{sortDir === 'desc' ? '↓' : '↑'}</span>
    }

    // winner annotation for final ranking column
    const maxScore = Math.max(...teams.map(t => t.totalScore ?? 0))

    return (
        <div className="space-y-5">

            {/* Header actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari nama tim atau nomor stand..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none"
                        style={{
                            border: '2px solid var(--card-border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            width: 280,
                        }}
                        onFocus={e => { e.target.style.borderColor = 'var(--zetech-accent)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--card-border)' }}
                    />
                </div>

                <div className="flex gap-2">
                    {/* Summary pill */}
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl" style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                        {sorted.length} tim ditampilkan
                    </span>
                    {/* Export button (placeholder) */}
                    <button
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                        style={{ background: 'var(--zetech-blue)', color: 'white' }}
                        onClick={() => alert('Fitur export ke CSV/PDF — sambungkan ke BE')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                                    Rank
                                </th>
                                {([
                                    ['standNumber', 'Stand'],
                                    ['name', 'Nama Tim'],
                                    ['voteCount', 'Vote'],
                                    ['totalScore', 'Nilai Akhir'],
                                ] as [SortKey, string][]).map(([key, label]) => (
                                    <th
                                        key={key}
                                        className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                                        style={{ color: 'var(--text-secondary)' }}
                                        onClick={() => toggleSort(key)}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            {label} <SortIcon k={key} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((team, idx) => {
                                const rank = idx + 1
                                const badge = getRankBadge(rank)
                                const isTop = (team.totalScore ?? 0) === maxScore
                                return (
                                    <tr
                                        key={team.id}
                                        style={{
                                            borderBottom: '1px solid var(--card-border)',
                                            background: isTop ? 'rgba(79,142,247,0.03)' : undefined,
                                        }}
                                        className="transition-colors hover:bg-blue-50/30"
                                    >
                                        {/* Rank */}
                                        <td className="px-5 py-4">
                                            {badge.emoji ? (
                                                <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg w-fit" style={badge.style}>
                                                    {badge.emoji} #{rank}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-mono text-gray-400">#{rank}</span>
                                            )}
                                        </td>

                                        {/* Stand */}
                                        <td className="px-5 py-4">
                                            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-display"
                                                style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                                                {String(team.standNumber).padStart(2, '0')}
                                            </span>
                                        </td>

                                        {/* Name */}
                                        <td className="px-5 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {team.name}
                                        </td>

                                        {/* Vote */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: 'rgba(99,102,241,0.1)', color: '#4338ca' }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 22V11L2 9V22h5zm15 0V9l-8-7-7 7v13h4v-7h7v7h4z" /></svg>
                                                {team.voteCount}
                                            </span>
                                        </td>

                                        {/* Score bar */}
                                        <td className="px-5 py-4 min-w-[180px]">
                                            <ScoreBar value={team.totalScore ?? 0} />
                                        </td>
                                    </tr>
                                )
                            })}
                            {sorted.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        Tidak ada tim yang cocok dengan pencarian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 flex justify-between items-center" style={{ borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Menampilkan {sorted.length} dari {teams.length} tim
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Klik header kolom untuk mengurutkan
                    </p>
                </div>
            </div>
        </div>
    )
}
