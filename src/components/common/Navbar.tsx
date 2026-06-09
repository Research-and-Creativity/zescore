import { useLocation } from 'react-router-dom'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
    '/admin/dashboard': { title: 'Dashboard', subtitle: 'Ringkasan perolehan nilai & voting' },
    '/admin/teams': { title: 'Data Tim', subtitle: 'Kelola tim peserta PT3 Expo' },
    '/admin/recap': { title: 'Rekapitulasi', subtitle: 'Tabel dan grafik nilai akhir' },
}

export default function Navbar() {
    const { pathname } = useLocation()
    const info = PAGE_TITLES[pathname] ?? { title: 'ZeScore', subtitle: '' }

    return (
        <header
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--card-border)',
                boxShadow: '0 1px 0 rgba(112,144,176,0.08)',
            }}
        >
            <div>
                <h1 className="text-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                    {info.title}
                </h1>
                {info.subtitle && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {info.subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Live badge */}
                <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: '#DCFCE7', color: '#15803d' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                </span>
                {/* PT3 badge */}
                <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--zetech-light)', color: 'var(--zetech-blue)' }}
                >
                    PT3 Expo 2025
                </span>
            </div>
        </header>
    )
}
