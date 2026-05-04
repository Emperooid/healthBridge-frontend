'use client'

import { ReactNode } from 'react'
import { useUIStore } from '@/store/ui.store'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { cn } from '@/utils/cn'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={cn('flex flex-col transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-16')}>
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
