import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AdminLayout from '@/layouts/AdminLayout'
import KioskLayout from '@/layouts/KioskLayout'

import LoginPage     from '@/features/auth/LoginPage'
import DashboardPage from '@/features/admin/DashboardPage'
import TeamsPage     from '@/features/admin/TeamPage'
import UsersPage     from '@/features/admin/UsersPage'
import RecapPage     from '@/features/admin/RecapPage'
import KioskPage     from '@/features/kiosk/KioskPage'

import ProtectedRoute from '@/components/common/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Login khusus Admin */}
          <Route path="/login" element={<LoginPage />} />

          {/* Kiosk — publik, tanpa auth. Mesin kasir bebas diakses siapa saja. */}
          <Route path="/kiosk" element={<KioskLayout><KioskPage /></KioskLayout>} />

          {/* Admin — protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="teams"     element={<TeamsPage />} />
              <Route path="users"     element={<UsersPage />} />
              <Route path="recap"     element={<RecapPage />} />
            </Route>
          </Route>

          {/* Default landing -> langsung ke kiosk (mesin kasir publik) */}
          <Route path="/" element={<Navigate to="/kiosk" replace />} />
          <Route path="*" element={<Navigate to="/kiosk" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
