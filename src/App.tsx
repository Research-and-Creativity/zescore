import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import AdminLayout from '@/layouts/AdminLayout'
import KioskLayout from '@/layouts/KioskLayout'

// Pages — Admin (Dev 2)
import LoginPage from '@/features/auth/LoginPage'
import DashboardPage from '@/features/admin/DashboardPage'
import TeamsPage from '@/features/admin/TeamsPage'
import RecapPage from '@/features/admin/RecapPage'

// Pages — Kiosk (Dev 1)
import KioskMain from '@/features/kiosk/KioskMain'

// Guards
import ProtectedRoute from '@/components/common/ProtectedRoute'
import KioskRoute from '@/components/common/KioskRoute'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Public ─────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Admin — protected (Dev 2) ───────────────────── */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="teams"     element={<TeamsPage />} />
              <Route path="recap"     element={<RecapPage />} />
            </Route>
          </Route>

          {/* ── Kiosk — protected (Dev 1) ───────────────────── */}
          <Route element={<KioskRoute />}>
            <Route path="/kiosk" element={<KioskLayout><KioskMain /></KioskLayout>} />
          </Route>

          {/* ── Fallback ─────────────────────────────────────── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App