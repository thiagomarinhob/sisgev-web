import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { AuthContextValue } from "@/shared/types/auth.types"

const mockNavigate = vi.fn()

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}))

const { mockLogin } = vi.hoisted(() => ({ mockLogin: vi.fn() }))

const defaultAuthValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
  logout: vi.fn(),
}

let authValue: AuthContextValue = { ...defaultAuthValue }

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => authValue,
}))

import { LoginPage } from "../pages/LoginPage"

function renderLogin() {
  return render(<LoginPage />)
}

describe("LoginPage", () => {
  beforeEach(() => {
    authValue = { ...defaultAuthValue }
    vi.clearAllMocks()
  })

  it("renders email and password fields with a submit button", () => {
    renderLogin()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument()
  })

  it("AUTH-01: redirects to /admin/dashboard for ADMIN_OPERACIONAL after login", async () => {
    const user = userEvent.setup()
    mockLogin.mockImplementation(async () => {
      authValue = {
        ...authValue,
        user: { id: "1", name: "Admin", email: "a@a.com", role: "ADMIN_OPERACIONAL", municipalityId: null },
        isAuthenticated: true,
      }
    })

    const { rerender } = render(<LoginPage />)
    await user.type(screen.getByLabelText(/e-mail/i), "a@a.com")
    await user.type(screen.getByLabelText(/senha/i), "pass")
    await user.click(screen.getByRole("button", { name: /entrar/i }))
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("a@a.com", "pass"))

    rerender(<LoginPage />)
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard", { replace: true }),
    )
  })

  it("AUTH-02: redirects to /prefeitura/dashboard for GESTOR_PREFEITURA", async () => {
    const user = userEvent.setup()
    mockLogin.mockImplementation(async () => {
      authValue = {
        ...authValue,
        user: { id: "2", name: "Gestor", email: "g@g.com", role: "GESTOR_PREFEITURA", municipalityId: "m1" },
        isAuthenticated: true,
      }
    })

    const { rerender } = render(<LoginPage />)
    await user.type(screen.getByLabelText(/e-mail/i), "g@g.com")
    await user.type(screen.getByLabelText(/senha/i), "pass")
    await user.click(screen.getByRole("button", { name: /entrar/i }))
    await waitFor(() => expect(mockLogin).toHaveBeenCalled())

    rerender(<LoginPage />)
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/prefeitura/dashboard", { replace: true }))
  })

  it("AUTH-03: displays error message when login throws", async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce(new Error("Unauthorized"))

    renderLogin()
    await user.type(screen.getByLabelText(/e-mail/i), "x@x.com")
    await user.type(screen.getByLabelText(/senha/i), "wrong")
    await user.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/credenciais inválidas/i)
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("AUTH-04: redirects authenticated user without rendering the form", () => {
    authValue = {
      ...authValue,
      user: { id: "1", name: "Admin", email: "a@a.com", role: "SUPER_ADMIN", municipalityId: null },
      isAuthenticated: true,
    }

    renderLogin()

    expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard", { replace: true })
  })
})
