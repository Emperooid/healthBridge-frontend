'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { clearSession } from '@/app/actions/auth'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { cn } from '@/utils/cn'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { isAuthenticated, _hasHydrated, accessToken, user } = useAuthStore()
  const redirectingRef = useRef(false)
  const refreshAttemptedRef = useRef(false)

  // Start with sidebar closed on mobile so it doesn't overlay content
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [setSidebarOpen])

  // accessToken is memory-only and lost on page reload. Proactively refresh it before
  // child components mount and fire API calls that would otherwise get 401.
  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || accessToken || !user || refreshAttemptedRef.current) return
    refreshAttemptedRef.current = true
    const { id, role, email, name } = user  // capture before async boundary
    fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(async (json) => {
        const newToken: string = json?.data?.accessToken ?? json?.accessToken
        if (newToken) {
          useAuthStore.getState().setTokens(newToken)
          // Render's cookie uses its own SESSION_SECRET — re-write the locally-signed one
          const { writeSession } = await import('@/app/actions/auth')
          await writeSession(id, role, email, name).catch(() => {})
        }
      })
      .catch((r) => {
        // Only force logout when the server explicitly rejects the refresh token.
        // Network errors / Render cold-start timeouts must NOT clear the session —
        // the hb_session cookie is still valid and the user should stay logged in.
        if (r && typeof r.status === 'number' && (r.status === 401 || r.status === 403)) {
          useAuthStore.getState().clearAuth()
        }
      })
  }, [_hasHydrated, isAuthenticated, accessToken, user])

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated && !redirectingRef.current) {
      redirectingRef.current = true
      clearSession().catch(() => {
        window.location.replace('/login')
      })
    }
  }, [_hasHydrated, isAuthenticated])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {/* Mobile overlay — closes sidebar when tapping outside it */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          'flex flex-col transition-all duration-300 ease-in-out',
          'ml-0 lg:ml-14',
          sidebarOpen && 'lg:ml-60'
        )}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
