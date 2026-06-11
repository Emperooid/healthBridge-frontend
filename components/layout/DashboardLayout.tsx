'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { clearSession } from '@/app/actions/auth'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { cn } from '@/utils/cn'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore()
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const redirectingRef = useRef(false)

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated && !redirectingRef.current) {
      redirectingRef.current = true
      // Use server action redirect — window.location is intercepted by Turbopack
      // as an RSC soft-refresh instead of a real navigation, causing a reload loop.
      clearSession().catch(() => {
        window.location.replace('/login')
      })
    }
  }, [_hasHydrated, isAuthenticated])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={cn('flex flex-col transition-all duration-300 ease-in-out', sidebarOpen ? 'ml-60' : 'ml-14')}>
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
