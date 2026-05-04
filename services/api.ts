import axios, { type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request: attach access token ────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hb_access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: unwrap envelope + handle 401 with token refresh ───────────────
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
        const refreshToken = localStorage.getItem('hb_refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        const newAccess: string = data?.data?.accessToken ?? data?.accessToken
        localStorage.setItem('hb_access_token', newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        drainQueue(newAccess, null)
        return api(original)
      } catch (refreshError) {
        drainQueue(null, refreshError)
        localStorage.removeItem('hb_access_token')
        localStorage.removeItem('hb_refresh_token')
        if (typeof window !== 'undefined') window.location.href = '/login'
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
