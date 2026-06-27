import MockAdapter from "axios-mock-adapter"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import apiClient, { refreshHttpClient } from "../apiClient"
import { clearAccessToken, getAccessToken, REFRESH_KEY, setAccessToken } from "../tokenStore"

let mock: MockAdapter
let refreshMock: MockAdapter

beforeEach(() => {
  mock = new MockAdapter(apiClient)
  refreshMock = new MockAdapter(refreshHttpClient)
  clearAccessToken()
  localStorage.clear()
  delete (window as unknown as { location: unknown }).location
  ;(window as unknown as { location: unknown }).location = { href: "" }
})

afterEach(() => {
  mock.restore()
  refreshMock.restore()
  vi.restoreAllMocks()
})

describe("apiClient — request interceptor (AUTH-08)", () => {
  it("adds Authorization: Bearer header when token is present", async () => {
    setAccessToken("my-access-token")
    mock.onGet("/test").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer my-access-token")
      return [200, {}]
    })
    await apiClient.get("/test")
  })

  it("omits Authorization header when no token is present", async () => {
    mock.onGet("/test").reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined()
      return [200, {}]
    })
    await apiClient.get("/test")
  })
})

describe("apiClient — response interceptor 401 refresh (AUTH-09)", () => {
  it("retries original request after refreshing token on 401", async () => {
    setAccessToken("expired-token")
    localStorage.setItem(REFRESH_KEY, "valid-refresh")

    let callCount = 0
    mock.onGet("/protected").reply(() => {
      callCount++
      if (callCount === 1) return [401, {}]
      return [200, { data: "ok" }]
    })
    refreshMock.onPost("/auth/refresh").reply(200, { accessToken: "new-access-token" })

    const response = await apiClient.get("/protected")
    expect(response.data).toEqual({ data: "ok" })
    expect(callCount).toBe(2)
    expect(getAccessToken()).toBe("new-access-token")
  })
})

describe("apiClient — response interceptor 401 refresh fail (AUTH-10)", () => {
  it("clears token, removes refresh from localStorage, and redirects to /login on refresh failure", async () => {
    setAccessToken("expired-token")
    localStorage.setItem(REFRESH_KEY, "invalid-refresh")

    mock.onGet("/protected").reply(401, {})
    refreshMock.onPost("/auth/refresh").reply(401, {})

    await expect(apiClient.get("/protected")).rejects.toBeDefined()

    expect((window.location as { href: string }).href).toBe("/login")
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull()
    expect(getAccessToken()).toBeNull()
  })
})
