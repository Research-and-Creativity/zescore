interface Props {
    label: string
    value: string | number
    sub?: string
    icon: React.ReactNode
    color: string   // hex gradient color pair  e.g. "#1B3FA0,#4F8EF7"
}

export default function StatCard({ label, value, sub, icon, color }: Props) {
    const [c1, c2] = color.split(',')
    return (
        <div className="card p-5 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
            >
                {icon}
            </div>
            <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-2xl font-bold text-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
                {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
            </div>
        </div>
    )
}
