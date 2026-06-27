// src/features/admin/RecapPage.tsx
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as XLSX from 'xlsx'
import api from '@/config/api'

interface RecapEntry {
    teamId: string
    teamName: string
    boothNumber: string
    votesPoster: number
    votesProduct: number
    totalVotes: number
    assessorCount: number
    avgPoster: number
    avgProduct: number
    avgTotalScore: number
}

const MOCK: RecapEntry[] = [
    { teamId: '1', teamName: 'HealthAlert System', boothNumber: 'B2', votesPoster: 5, votesProduct: 4, totalVotes: 9, assessorCount: 5, avgPoster: 90.6, avgProduct: 90.0, avgTotalScore: 90.3 },
    { teamId: '2', teamName: 'EduBot Learning', boothNumber: 'A2', votesPoster: 8, votesProduct: 7, totalVotes: 15, assessorCount: 5, avgPoster: 91.2, avgProduct: 88.8, avgTotalScore: 90.0 },
    { teamId: '3', teamName: 'Aqua Smart Monitor', boothNumber: 'A1', votesPoster: 6, votesProduct: 6, totalVotes: 12, assessorCount: 5, avgPoster: 87.2, avgProduct: 90.2, avgTotalScore: 85.0 },
    { teamId: '4', teamName: 'SmartParking Pro', boothNumber: 'C2', votesPoster: 2, votesProduct: 2, totalVotes: 4, assessorCount: 5, avgPoster: 82.8, avgProduct: 84.6, avgTotalScore: 83.7 },
    { teamId: '5', teamName: 'WasteTrack IoT', boothNumber: 'B1', votesPoster: 3, votesProduct: 3, totalVotes: 6, assessorCount: 5, avgPoster: 75.2, avgProduct: 76.8, avgTotalScore: 77.0 },
    { teamId: '6', teamName: 'AgriSense Platform', boothNumber: 'C1', votesPoster: 2, votesProduct: 2, totalVotes: 4, assessorCount: 5, avgPoster: 70.0, avgProduct: 74.0, avgTotalScore: 72.0 },
]

const fetchRecap = () =>
    api.get<RecapEntry[]>('/admin/recap').then(r => r.data).catch(() => MOCK)

type SortKey = 'boothNumber' | 'teamName' | 'votesPoster' | 'votesProduct' | 'totalVotes' | 'assessorCount' | 'avgPoster' | 'avgProduct' | 'avgTotalScore'
type SortDir = 'asc' | 'desc'

// ─── Export Excel ──────────────────────────────────────────────────────────────
function exportToExcel(data: RecapEntry[], sorted: RecapEntry[]) {
    const wb = XLSX.utils.book_new()

    // ── Sheet 1: Rekapitulasi Utama ──
    const headerRow = [
        'Rank', 'Stand', 'Nama Tim',
        'Penilai (Dosen)', 'Vote Poster', 'Vote Product', 'Total Vote',
        'Nilai Poster', 'Nilai Product', 'Nilai Akhir'
    ]

    const rows = sorted.map((entry, idx) => [
        idx + 1,
        entry.boothNumber,
        entry.teamName,
        entry.assessorCount,
        entry.votesPoster,
        entry.votesProduct,
        entry.totalVotes,
        entry.avgPoster,
        entry.avgProduct,
        entry.avgTotalScore,
    ])

    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...rows])

    // Column widths
    ws['!cols'] = [
        { wch: 6 },   // Rank
        { wch: 8 },   // Stand
        { wch: 28 },  // Nama Tim
        { wch: 18 },  // Penilai
        { wch: 14 },  // Vote Poster
        { wch: 14 },  // Vote Product
        { wch: 12 },  // Total Vote
        { wch: 14 },  // Nilai Poster
        { wch: 14 },  // Nilai Product
        { wch: 12 },  // Nilai Akhir
    ]

    // Style header row (bold via cell metadata — SheetJS Community Edition)
    const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1')
    for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddr = XLSX.utils.encode_cell({ r: 0, c: C })
        if (!ws[cellAddr]) continue
        ws[cellAddr].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '1B3FA0' } },
            alignment: { horizontal: 'center' },
        }
    }

    // Highlight top 3
    const rankColors: Record<number, string> = { 1: 'FEF3C7', 2: 'F3F4F6', 3: 'FEE2E2' }
    for (let R = 1; R <= Math.min(3, rows.length); R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellAddr = XLSX.utils.encode_cell({ r: R, c: C })
            if (!ws[cellAddr]) continue
            ws[cellAddr].s = {
                fill: { fgColor: { rgb: rankColors[R] } },
                font: { bold: true },
            }
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Rekapitulasi')

    // ── Sheet 2: Ringkasan ──
    const summarySheet = XLSX.utils.aoa_to_sheet([
        ['ZeScore — PT3 Expo 2026'],
        [''],
        ['Diekspor pada', new Date().toLocaleString('id-ID')],
        [''],
        ['Statistik Global'],
        ['Total Tim', data.length],
        ['Total Vote Poster', data.reduce((s, r) => s + (r.votesPoster ?? 0), 0)],
        ['Total Vote Product', data.reduce((s, r) => s + (r.votesProduct ?? 0), 0)],
        ['Total Vote', data.reduce((s, r) => s + (r.totalVotes ?? 0), 0)],
        ['Rata-rata Nilai Poster', data.length ? (data.reduce((s, r) => s + r.avgPoster, 0) / data.length).toFixed(1) : 0],
        ['Rata-rata Nilai Product', data.length ? (data.reduce((s, r) => s + r.avgProduct, 0) / data.length).toFixed(1) : 0],
        [''],
        ['🥇 Juara 1', sorted[0]?.teamName ?? '-', `Nilai: ${sorted[0]?.avgTotalScore ?? 0}`],
        ['🥈 Juara 2', sorted[1]?.teamName ?? '-', `Nilai: ${sorted[1]?.avgTotalScore ?? 0}`],
        ['🥉 Juara 3', sorted[2]?.teamName ?? '-', `Nilai: ${sorted[2]?.avgTotalScore ?? 0}`],
    ])
    summarySheet['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan')

    // Download
    const timestamp = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(wb, `ZeScore_Rekap_PT3Expo_${timestamp}.xlsx`)
}

// ─── Sub components ────────────────────────────────────────────────────────────
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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function RecapPage() {
    const { data: recap = MOCK } = useQuery({
        queryKey: ['admin-recap'],
        queryFn: fetchRecap,
        placeholderData: MOCK,
        refetchInterval: 30_000,
    })

    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('avgTotalScore')
    const [sortDir, setSortDir] = useState<SortDir>('desc')
    const [exporting, setExporting] = useState(false)

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

    const handleExport = () => {
        setExporting(true)
        try {
            // sorted sudah dalam urutan yang tampil di tabel sekarang
            exportToExcel(recap, sorted)
        } finally {
            setTimeout(() => setExporting(false), 800)
        }
    }

    const totalVotesPoster = recap.reduce((s, r) => s + (r.votesPoster ?? 0), 0)
    const totalVotesProduct = recap.reduce((s, r) => s + (r.votesProduct ?? 0), 0)

    return (
        <div className="space-y-5">

            {/* Summary cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#EEF3FF' }}>🖼️</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Avg Nilai Poster</p>
                            <p className="text-xl font-black text-display" style={{ color: 'var(--zetech-blue)' }}>
                                {recap.length ? (recap.reduce((s, r) => s + (r.avgPoster ?? 0), 0) / recap.length).toFixed(1) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#F0FDF4' }}>💡</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Avg Nilai Product</p>
                            <p className="text-xl font-black text-display" style={{ color: '#16a34a' }}>
                                {recap.length ? (recap.reduce((s, r) => s + (r.avgProduct ?? 0), 0) / recap.length).toFixed(1) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#EFF6FF' }}>🗳️</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Vote Poster</p>
                            <p className="text-xl font-black text-display" style={{ color: '#4F8EF7' }}>{totalVotesPoster}</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: '#F5F3FF' }}>🗳️</div>
                        <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Vote Product</p>
                            <p className="text-xl font-black text-display" style={{ color: '#6366f1' }}>{totalVotesProduct}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
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
                        {sorted.length} tim
                    </span>
                    <button onClick={handleExport} disabled={exporting}
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', boxShadow: '0 2px 10px rgba(22,163,74,0.3)' }}>
                        {exporting ? (
                            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        )}
                        {exporting ? 'Menyiapkan...' : 'Export Excel'}
                    </button>
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
                                    ['votesPoster', '🗳️ Vote Poster'],
                                    ['votesProduct', '🗳️ Vote Product'],
                                    ['avgPoster', '🖼️ Nilai Poster'],
                                    ['avgProduct', '💡 Nilai Product'],
                                    ['avgTotalScore', 'Nilai Akhir'],
                                ] as [SortKey, string][]).map(([key, label]) => (
                                    <th key={key}
                                        className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
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
                                        <td className="px-4 py-4">
                                            {badge.emoji ? (
                                                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg w-fit" style={badge.style}>
                                                    {badge.emoji} #{rank}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>#{rank}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
                                                style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}>
                                                {entry.boothNumber}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{entry.teamName}</td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: '#EEF3FF', color: 'var(--zetech-blue)' }}>
                                                {entry.assessorCount} dosen
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: 'rgba(79,142,247,0.12)', color: '#1B3FA0' }}>
                                                🖼️ {entry.votesPoster}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: 'rgba(99,102,241,0.1)', color: '#4338ca' }}>
                                                💡 {entry.votesProduct}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 min-w-32">
                                            <MiniBar value={entry.avgPoster} color="#4F8EF7" />
                                        </td>
                                        <td className="px-4 py-4 min-w-32">
                                            <MiniBar value={entry.avgProduct} color="#16a34a" />
                                        </td>
                                        <td className="px-4 py-4 min-w-45">
                                            <ScoreBar value={entry.avgTotalScore} />
                                        </td>
                                    </tr>
                                )
                            })}
                            {sorted.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
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