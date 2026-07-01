import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/features/auth/hooks/useAuth"
import type { UserRole } from "@/shared/types/auth.types"
import { dashboardForRole } from "@/shared/utils/auth.utils"

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}

interface RoleGuardProps {
  allowedRoles: UserRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (!user || !allowedRoles.includes(user.role)) {
    const destination = user ? (dashboardForRole(user.role) ?? "/login") : "/login"
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
