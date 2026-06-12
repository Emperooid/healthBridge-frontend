'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '@/types'

interface AuthStore extends AuthState {
  _hasHydrated: boolean
  setUser: (user: User, accessToken: string) => void
  setTokens: (accessToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setHasHydrated: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      setUser: (user, accessToken) => {
        if (typeof window !== 'undefined') {
          // accessToken is memory-only; refreshToken is an HttpOnly cookie — no JS storage needed
          // Clean up any stale tokens that may exist from older versions
          localStorage.removeItem('hb_access_token')
          localStorage.removeItem('hb_refresh_token')
          sessionStorage.removeItem('hb_access_token')
          sessionStorage.removeItem('hb_refresh_token')
        }
        set({ user, accessToken, refreshToken: null, isAuthenticated: true, isLoading: false })
      },

      // Called by the Axios refresh interceptor after a silent token refresh
      setTokens: (accessToken) => {
        set({ accessToken })
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hb_access_token')
          localStorage.removeItem('hb_refresh_token')
          sessionStorage.removeItem('hb_access_token')
          sessionStorage.removeItem('hb_refresh_token')
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false })
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setHasHydrated: () => set({ _hasHydrated: true }),
    }),
    {
      name: 'hb_auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Tokens are never persisted — accessToken is memory-only, refreshToken is HttpOnly cookie
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated()
      },
    }
  )
)
