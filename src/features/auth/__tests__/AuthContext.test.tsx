import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { ReactNode } from "react"

const { mockLoginApi, mockLogoutApi, mockGetMeApi, mockRefreshAccessToken } = vi.hoisted(() => ({
  mockLoginApi: vi.fn(),
  mockLogoutApi: vi.fn(),
  mockGetMeApi: vi.fn(),
  mockRefreshAccessToken: vi.fn(),
}))

vi.mock("@/shared/services/authService", () => ({
  loginApi: mockLoginApi,
  logoutApi: mockLogoutApi,
  getMeApi: mockGetMeApi,
}))

vi.mock("@/shared/services/apiClient", () => ({
  refreshAccessToken: mockRefreshAccessToken,
  default: {},
}))

import { AuthProvider } from "../context/AuthContext"
import { useAuth } from "../hooks/useAuth"
import { clearAccessToken, getAccessToken, REFRESH_KEY } from "@/shared/services/tokenStore"

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

const fakeUser = {
  id: "u1",
  name: "Test User",
  email: "user@sgev.br",
  role: "ADMIN_OPERACIONAL" as const,
  municipalityId: null,
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear()
    clearAccessToken()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
    clearAccessToken()
  })

  describe("initial state", () => {
    it("is not authenticated when no refresh token in localStorage", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })

  describe("login (AUTH-05, AUTH-06)", () => {
    it("AUTH-05: stores accessToken in memory (not localStorage) after login", async () => {
      mockLoginApi.mockResolvedValueOnce({
        accessToken: "acc-token",
        refreshToken: "ref-token",
        user: fakeUser,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.login("user@sgev.br", "pass")
      })

      expect(getAccessToken()).toBe("acc-token")
      expect(localStorage.getItem("access_token")).toBeNull()
    })

    it("AUTH-06: stores refreshToken in localStorage under 'refresh_token'", async () => {
      mockLoginApi.mockResolvedValueOnce({
        accessToken: "acc-token",
        refreshToken: "ref-token",
        user: fakeUser,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.login("user@sgev.br", "pass")
      })

      expect(localStorage.getItem(REFRESH_KEY)).toBe("ref-token")
    })

    it("sets user and isAuthenticated after successful login", async () => {
      mockLoginApi.mockResolvedValueOnce({
        accessToken: "acc",
        refreshToken: "ref",
        user: fakeUser,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.login("user@sgev.br", "pass")
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(fakeUser)
    })
  })

  describe("AUTH-07: session restore on mount", () => {
    it("restores user session when refresh_token exists in localStorage", async () => {
      localStorage.setItem(REFRESH_KEY, "stored-refresh")
      mockRefreshAccessToken.mockResolvedValueOnce(undefined)
      mockGetMeApi.mockResolvedValueOnce(fakeUser)

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(mockRefreshAccessToken).toHaveBeenCalledOnce()
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(fakeUser)
    })

    it("AUTH-07 (fail): clears localStorage entry on refresh failure, user remains null", async () => {
      localStorage.setItem(REFRESH_KEY, "expired-refresh")
      mockRefreshAccessToken.mockRejectedValueOnce(new Error("expired"))

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(localStorage.getItem(REFRESH_KEY)).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })

  describe("logout", () => {
    it("clears user, accessToken, and refreshToken after logout", async () => {
      mockLoginApi.mockResolvedValueOnce({
        accessToken: "acc",
        refreshToken: "ref",
        user: fakeUser,
      })
      mockLogoutApi.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.login("user@sgev.br", "pass")
      })
      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(getAccessToken()).toBeNull()
      expect(localStorage.getItem(REFRESH_KEY)).toBeNull()
    })
  })
})
