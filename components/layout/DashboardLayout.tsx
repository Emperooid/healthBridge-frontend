'use client'

import { ReactNode, useEffect } from 'react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { cn } from '@/utils/cn'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore()
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      window.location.href = '/login'
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
