import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface Props {
    role?: 'admin' | 'participant'
}

export default function ProtectedRoute({ role }: Props) {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (role && user?.role !== role) return <Navigate to="/login" replace />

    return <Outlet />
}
