// src/features/kiosk/KioskTeamSelect.tsx
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useKioskStore } from '@/store/useKioskStore'
import api from '@/config/api'

interface TeamOption {
    id: string
    teamName: string
    boothNumber: string
}

const MOCK_TEAMS: TeamOption[] = [
    { id: '1', teamName: 'Aqua Smart Monitor', boothNumber: 'A1' },
    { id: '2', teamName: 'EduBot Learning', boothNumber: 'A2' },
    { id: '3', teamName: 'WasteTrack IoT', boothNumber: 'B1' },
    { id: '4', teamName: 'HealthAlert System', boothNumber: 'B2' },
    { id: '5', teamName: 'AgriSense Platform', boothNumber: 'C1' },
    { id: '6', teamName: 'SmartParking Pro', boothNumber: 'C2' },
]

const fetchTeams = () =>
    api.get<TeamOption[]>('/kiosk/teams').then(r => r.data).catch(() => MOCK_TEAMS)

const BOOTH_COLOR: Record<string, string> = {
    A: '#4F8EF7', B: '#6366f1', C: '#0891b2', D: '#16a34a', E: '#d97706', F: '#dc2626',
}
const bc = (b: string) => BOOTH_COLOR[b?.charAt(0).toUpperCase()] ?? '#64748b'

const KioskTeamSelect: React.FC = () => {
    const { evaluator, setSelectedTeam, setStep, resetKiosk } = useKioskStore()
    const [search, setSearch] = useState('')

    const { data: teams = MOCK_TEAMS, isLoading } = useQuery({
        queryKey: ['kiosk-teams'],
        queryFn: fetchTeams,
        placeholderData: MOCK_TEAMS,
    })

    if (!evaluator) return null

    const filtered = teams.filter(t =>
        t.teamName.toLowerCase().includes(search.toLowerCase()) ||
        t.boothNumber.toLowerCase().includes(search.toLowerCase())
    )

    const handlePick = (team: TeamOption) => {
        setSelectedTeam({ teamId: team.id, teamName: team.teamName, boothNumber: team.boothNumber })
        setStep('CATEGORY_SELECT')
    }

    return (
        <div className="w-full max-w-3xl">
            {/* Greeting */}
            <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Halo,</p>
                <h2 className="text-2xl font-black text-slate-900">{evaluator.name}</h2>
                <p className="text-sm text-slate-500 mt-1">Pilih tim/kelompok yang ingin kamu nilai</p>
            </div>

            {/* Search */}
            <div className="relative mb-5 max-w-md mx-auto">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: 'var(--text-secondary)' }}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Cari nama tim atau nomor stand..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none transition-all bg-white border-2 border-slate-200 focus:border-blue-400"
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5 animate-pulse h-28" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filtered.map(team => {
                        const color = bc(team.boothNumber)
                        return (
                            <button key={team.id} onClick={() => handlePick(team)}
                                className="text-left bg-white rounded-2xl border-2 border-slate-200 p-5 transition-all active:scale-[0.97] hover:shadow-lg"
                                style={{ borderColor: 'transparent' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black mb-3"
                                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                                    {team.boothNumber}
                                </div>
                                <p className="font-bold text-sm text-slate-900 leading-tight">{team.teamName}</p>
                                <p className="text-xs text-slate-400 mt-1">Stand {team.boothNumber}</p>
                            </button>
                        )
                    })}

                    {filtered.length === 0 && (
                        <div className="col-span-3 py-12 text-center text-slate-400">
                            <p className="text-sm">Tidak ada tim yang cocok.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center mt-6">
                <button onClick={resetKiosk}
                    className="text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
                    style={{ color: 'var(--text-secondary)', border: '1.5px solid var(--card-border)', background: 'white' }}>
                    ← Ganti Identitas
                </button>
            </div>
        </div>
    )
}

export default KioskTeamSelect
