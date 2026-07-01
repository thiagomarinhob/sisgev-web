import type { UserRole } from "@/shared/types/auth.types"

export function dashboardForRole(role: UserRole): string | null {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN_OPERACIONAL":
      return "/admin/dashboard"
    case "GESTOR_PREFEITURA":
    case "VISUALIZADOR":
      return "/prefeitura/dashboard"
    default:
      return null
  }
}
