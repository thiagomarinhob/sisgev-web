import { afterEach, describe, expect, it } from "vitest"

import {
  clearAccessToken,
  getAccessToken,
  REFRESH_KEY,
  setAccessToken,
} from "../tokenStore"

describe("tokenStore", () => {
  afterEach(() => {
    clearAccessToken()
    localStorage.clear()
  })

  it("AUTH-05: getAccessToken returns null initially", () => {
    expect(getAccessToken()).toBeNull()
  })

  it("AUTH-05: setAccessToken stores value in memory", () => {
    setAccessToken("test-token")
    expect(getAccessToken()).toBe("test-token")
  })

  it("AUTH-05: setAccessToken never writes to localStorage", () => {
    setAccessToken("secret-token")
    expect(localStorage.getItem("access_token")).toBeNull()
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull()
    const allKeys = Object.keys(localStorage)
    const writtenAny = allKeys.some((k) => localStorage.getItem(k)?.includes("secret-token"))
    expect(writtenAny).toBe(false)
  })

  it("clearAccessToken resets to null", () => {
    setAccessToken("tok")
    clearAccessToken()
    expect(getAccessToken()).toBeNull()
  })

  it("setAccessToken(null) clears the value", () => {
    setAccessToken("tok")
    setAccessToken(null)
    expect(getAccessToken()).toBeNull()
  })
})
