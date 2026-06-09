import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import AdminLayout from '@/layouts/AdminLayout'

// Pages
import LoginPage from '@/features/auth/LoginPage'
// Guards
import ProtectedRoute from '@/components/common/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin (protected) */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
