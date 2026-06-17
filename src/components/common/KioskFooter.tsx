import React from 'react'
import logo from '@/assets/zetech-logo.svg'

const KioskFooter: React.FC = () => {
    return (
        <footer className="relative z-10 w-full px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
                <img src={logo} alt="Zetech" className="h-5 w-auto opacity-70" />
                <span className="text-xs font-semibold tracking-wide text-slate-400">
                    ZeScore <span className="font-normal text-slate-300">· PT3 Expo</span>
                </span>
            </div>
            <p className="text-xs text-slate-300">
                Powered by <span className="font-semibold text-slate-400">Zetech</span>
            </p>
        </footer>
    )
}

export default KioskFooter