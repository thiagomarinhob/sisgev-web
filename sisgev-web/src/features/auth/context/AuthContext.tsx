import { createContext, useCallback, useEffect, useState } from "react"
import type { ReactNode } from "react"

import { getMeApi, loginApi, logoutApi } from "@/shared/services/authService"
import { refreshAccessToken } from "@/shared/services/apiClient"
import {
  clearAccessToken,
  REFRESH_KEY,
  setAccessToken,
} from "@/shared/services/tokenStore"
import type { AuthContextValue, AuthUser } from "@/shared/types/auth.types"

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (!refreshToken) {
      setIsLoading(false)
      return
    }
    refreshAccessToken()
      .then(() => getMeApi())
      .then((me) => setUser(me))
      .catch(() => localStorage.removeItem(REFRESH_KEY))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password)
    setAccessToken(data.accessToken)
    localStorage.setItem(REFRESH_KEY, data.refreshToken)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // proceed regardless
    }
    clearAccessToken()
    localStorage.removeItem(REFRESH_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
