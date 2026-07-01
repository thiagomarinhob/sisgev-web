import axios from "axios"

import { clearAccessToken, getAccessToken, REFRESH_KEY, setAccessToken } from "./tokenStore"

const refreshHttpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

async function refreshAccessToken(): Promise<void> {
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) throw new Error("No refresh token")
  const { data } = await refreshHttpClient.post<{ accessToken: string; refreshToken?: string }>(
    "/auth/refresh",
    { refreshToken },
  )
  setAccessToken(data.accessToken)
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_KEY, data.refreshToken)
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        await refreshAccessToken()
        return apiClient(error.config)
      } catch {
        clearAccessToken()
        localStorage.removeItem(REFRESH_KEY)
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
export { refreshAccessToken, refreshHttpClient }
