import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPost, mockGet } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGet: vi.fn(),
}))

vi.mock("../apiClient", () => ({
  default: {
    post: mockPost,
    get: mockGet,
  },
}))

import { getMeApi, loginApi, logoutApi } from "../authService"

const fakeUser = {
  id: "u1",
  name: "Thiago",
  email: "admin@sgev.br",
  role: "ADMIN_OPERACIONAL" as const,
  municipalityId: null,
}

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("loginApi", () => {
    it("POSTs to /auth/login with email and password", async () => {
      const response = { accessToken: "acc", refreshToken: "ref", user: fakeUser }
      mockPost.mockResolvedValueOnce({ data: response })

      const result = await loginApi("admin@sgev.br", "pass123")

      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        email: "admin@sgev.br",
        password: "pass123",
      })
      expect(result).toEqual(response)
    })
  })

  describe("logoutApi", () => {
    it("POSTs to /auth/logout", async () => {
      mockPost.mockResolvedValueOnce({ data: null })

      await logoutApi()

      expect(mockPost).toHaveBeenCalledWith("/auth/logout")
    })
  })

  describe("getMeApi", () => {
    it("GETs /auth/me and returns AuthUser", async () => {
      mockGet.mockResolvedValueOnce({ data: fakeUser })

      const result = await getMeApi()

      expect(mockGet).toHaveBeenCalledWith("/auth/me")
      expect(result).toEqual(fakeUser)
    })
  })
})
