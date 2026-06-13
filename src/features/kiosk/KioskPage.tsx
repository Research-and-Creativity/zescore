// src/features/kiosk/KioskPage.tsx
import React from 'react'
import { useKioskStore } from '@/store/useKioskStore'
import KioskMain           from './KioskMain'
import KioskCategorySelect from './KioskCategorySelect'
import KioskScoreDosen     from './KioskScoreDosen'
import KioskSuccess        from './KioskSuccess'

/**
 * Flow:
 *  IDENTIFICATION  → KioskMain (input NIM/NIDN)
 *  CATEGORY_SELECT → KioskCategorySelect (pilih poster/product/keduanya)
 *  SCORE_DOSEN     → KioskScoreDosen (input nilai 0-100)
 *  SUCCESS         → KioskSuccess (auto-reset 5 detik)
 */
const KioskPage: React.FC = () => {
  const { step } = useKioskStore()

  if (step === 'CATEGORY_SELECT') return <KioskCategorySelect />
  if (step === 'SCORE_DOSEN')     return <KioskScoreDosen />
  if (step === 'SUCCESS')         return <KioskSuccess />
  return <KioskMain />
}

export default KioskPage
