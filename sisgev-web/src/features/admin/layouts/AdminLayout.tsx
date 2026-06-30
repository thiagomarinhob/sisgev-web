import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  MapPin,
  Route,
  Users2,
  Wrench,
  Camera,
} from "lucide-react"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/shared/types/auth.types"

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  roles: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Municípios",
    to: "/admin/municipalities",
    icon: Building2,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Usuários",
    to: "/admin/users",
    icon: Users2,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Estradas",
    to: "/admin/roads",
    icon: Route,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Trechos",
    to: "/admin/segments",
    icon: MapPin,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Evidências",
    to: "/admin/evidences",
    icon: Camera,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Avaliações",
    to: "/admin/assessments",
    icon: ClipboardCheck,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Ocorrências",
    to: "/admin/occurrences",
    icon: AlertTriangle,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Manutenção",
    to: "/admin/maintenance",
    icon: Wrench,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
  {
    label: "Relatórios",
    to: "/admin/reports",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "ADMIN_OPERACIONAL"],
  },
]

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_OPERACIONAL: "Admin Operacional",
  GESTOR_PREFEITURA: "Gestor",
  AGENTE_CAMPO: "Agente de Campo",
  VISUALIZADOR: "Visualizador",
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const visibleItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role),
  )

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-svh">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold tracking-tight text-sidebar-foreground">
            SisGEV
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {visibleItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-end border-b bg-card px-6 gap-3">
          <div className="text-right">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user ? ROLE_LABELS[user.role] : ""}
            </p>
          </div>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
