import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

const { mockUseAuth } = vi.hoisted(() => ({ mockUseAuth: vi.fn() }))

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: mockUseAuth,
}))

import { PrivateRoute } from "../guards"

function renderWithRouter(isAuthenticated: boolean, isLoading = false) {
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
    renderWithRouter(false)
    expect(screen.getByText("Login Page")).toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })

  it("AUTH-12: renders children for authenticated user", () => {
    renderWithRouter(true)
    expect(screen.getByText("Protected Content")).toBeInTheDocument()
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument()
  })

  it("renders nothing while loading (no redirect)", () => {
    renderWithRouter(false, true)
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument()
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
  })
})
