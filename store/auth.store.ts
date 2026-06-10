'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '@/types'

interface AuthStore extends AuthState {
  _hasHydrated: boolean
  setUser: (user: User, accessToken: string, refreshToken: string) => void
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

      setUser: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hb_access_token', accessToken)
          localStorage.setItem('hb_refresh_token', refreshToken)
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false })
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hb_access_token')
          localStorage.removeItem('hb_refresh_token')
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated()
      },
    }
  )
)
