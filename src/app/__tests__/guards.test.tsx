import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

const { mockUseAuth } = vi.hoisted(() => ({ mockUseAuth: vi.fn() }))

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: mockUseAuth,
}))

import { PrivateRoute, RoleGuard } from "../guards"
import type { UserRole } from "@/shared/types/auth.types"

// ─── PrivateRoute ────────────────────────────────────────────────────────────

function renderPrivateRoute(isAuthenticated: boolean, isLoading = false) {
  mockUseAuth.mockReturnValue({ isAuthenticated, isLoading, user: null, login: vi.fn(), logout: vi.fn() })
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe("PrivateRoute", () => {
  it("AUTH-11: redirects unauthenticated user to /login", () => {
    renderPrivateRoute(false)
    expect(screen.getByText("Login Page")).toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("AUTH-12: renders children for authenticated user", () => {
    renderPrivateRoute(true)
    expect(screen.getByText("Protected Content")).toBeInTheDocument()
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument()
  })

  it("renders nothing while loading (no redirect)", () => {
    renderPrivateRoute(false, true)
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })
})

// ─── RoleGuard ───────────────────────────────────────────────────────────────

function makeUser(role: UserRole) {
  return { id: "1", name: "Test User", email: "test@test.com", role, municipalityId: null }
}

function renderRoleGuard(
  allowedRoles: UserRole[],
  userRole: UserRole | null,
  isLoading = false,
) {
  const user = userRole ? makeUser(userRole) : null
  mockUseAuth.mockReturnValue({
    user,
    isAuthenticated: user !== null,
    isLoading,
    login: vi.fn(),
    logout: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={["/guarded"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/prefeitura/dashboard" element={<div>Prefeitura Dashboard</div>} />
        <Route element={<RoleGuard allowedRoles={allowedRoles} />}>
          <Route path="/guarded" element={<div>Guarded Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe("RoleGuard", () => {
  it("AUTH-13: redirects unauthenticated user to /login", () => {
    renderRoleGuard(["SUPER_ADMIN"], null)
    expect(screen.getByText("Login Page")).toBeInTheDocument()
    expect(screen.queryByText("Guarded Content")).not.toBeInTheDocument()
  })

  it("AUTH-14: renders children for user with allowed role", () => {
    renderRoleGuard(["SUPER_ADMIN", "ADMIN_OPERACIONAL"], "ADMIN_OPERACIONAL")
    expect(screen.getByText("Guarded Content")).toBeInTheDocument()
  })

  it("AUTH-15: blocks admin user from prefeitura routes (redirects to admin dashboard)", () => {
    renderRoleGuard(["GESTOR_PREFEITURA", "VISUALIZADOR"], "SUPER_ADMIN")
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument()
    expect(screen.queryByText("Guarded Content")).not.toBeInTheDocument()
  })

  it("AUTH-16: blocks prefeitura user from admin routes (redirects to prefeitura dashboard)", () => {
    renderRoleGuard(["SUPER_ADMIN", "ADMIN_OPERACIONAL"], "GESTOR_PREFEITURA")
    expect(screen.getByText("Prefeitura Dashboard")).toBeInTheDocument()
    expect(screen.queryByText("Guarded Content")).not.toBeInTheDocument()
  })

  it("renders nothing while loading", () => {
    renderRoleGuard(["SUPER_ADMIN"], null, true)
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument()
    expect(screen.queryByText("Guarded Content")).not.toBeInTheDocument()
  })
})
