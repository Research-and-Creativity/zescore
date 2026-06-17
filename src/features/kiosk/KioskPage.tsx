// src/features/kiosk/KioskPage.tsx
import React from 'react'
import { useKioskStore } from '@/store/useKioskStore'
import KioskMain           from './KioskMain'
import KioskTeamSelect      from './KioskTeamSelect'
import KioskCategorySelect from './KioskCategorySelect'
import KioskScoreDosen     from './KioskScoreDosen'
import KioskSuccess        from './KioskSuccess'

/**
 * Flow (mesin kasir publik, tanpa auth):
 *  IDENTIFICATION  → KioskMain (input NIM/NIDN)
 *  TEAM_SELECT     → KioskTeamSelect (pilih tim dari grid)
 *  CATEGORY_SELECT → KioskCategorySelect (pilih poster/product/keduanya)
 *  SCORE_DOSEN     → KioskScoreDosen (input nilai 0-100)
 *  SUCCESS         → KioskSuccess (auto-reset 5 detik)
 */
const KioskPage: React.FC = () => {
  const { step } = useKioskStore()

  if (step === 'TEAM_SELECT')     return <KioskTeamSelect />
  if (step === 'CATEGORY_SELECT') return <KioskCategorySelect />
  if (step === 'SCORE_DOSEN')     return <KioskScoreDosen />
  if (step === 'SUCCESS')         return <KioskSuccess />
  return <KioskMain />
}

export default KioskPage
