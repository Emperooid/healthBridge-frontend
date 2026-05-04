'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { capitalise } from '@/utils/format'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'

export function Navbar() {
  const router = useRouter()
  const { user, refreshToken, clearAuth } = useAuthStore()
  const { toggleSidebar } = useUIStore()

  const roleBadgeVariant = {
    admin: 'purple',
    doctor: 'info',
    patient: 'success',
  } as const

  async function handleLogout() {
    try {
      if (refreshToken) await authService.logout(refreshToken)
    } catch {
      // ignore network errors on logout
    }
    clearAuth()
    router.push('/login')
    toast.success('Logged out successfully')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 gap-3">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {user && (
          <Badge variant={roleBadgeVariant[user.role]}>
            {capitalise(user.role)}
          </Badge>
        )}

        <div className="h-6 w-px bg-slate-200" />

        {user && (
          <div className="flex items-center gap-2">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
