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
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const redirectingRef = useRef(false)

  // Start with sidebar closed on mobile so it doesn't overlay content
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [setSidebarOpen])

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
