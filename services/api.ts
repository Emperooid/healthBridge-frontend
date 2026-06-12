import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  // Required for the browser to send the HttpOnly hb_refresh_token cookie cross-origin
  withCredentials: true,
})

// ── Request: attach access token ────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Access token lives in Zustand memory only — never in any storage
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: unwrap envelope + handle 401 with silent token refresh ─────────
let refreshing = false
let queue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

function drainQueue(token: string | null, error: unknown) {
  queue.forEach((p) => (token ? p.resolve(token) : p.reject(error)))
  queue = []
}

api.interceptors.response.use(
  (response) => {
    // Unwrap { statusCode, message, data, timestamp } → data
    if (response.data && 'data' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`
              resolve(api(original))
            },
            reject,
          })
        })
      }

      original._retry = true
      refreshing = true

      try {
        // No body — the HttpOnly hb_refresh_token cookie is sent automatically
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, undefined, {
          withCredentials: true,
        })
        const newAccess: string = data?.data?.accessToken ?? data?.accessToken
        useAuthStore.getState().setTokens(newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        drainQueue(newAccess, null)
        return api(original)
      } catch (refreshError) {
        drainQueue(null, refreshError)
        useAuthStore.getState().clearAuth()
        // Navigation is handled by DashboardLayout which watches isAuthenticated
        return Promise.reject(refreshError)
      } finally {
        refreshing = false
      }
    }

    // Surface the backend message for toast display
    const message = error.response?.data?.message ?? error.message
    error.message = message
    return Promise.reject(error)
  }
)
