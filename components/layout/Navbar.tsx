'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { Badge } from '@/components/ui/Badge'
import { authService } from '@/services/auth.service'
import { notificationsService } from '@/services/notifications.service'
import { clearSession } from '@/app/actions/auth'
import { formatDateTime } from '@/utils/format'
import toast from 'react-hot-toast'

const roleBadgeVariant = {
  admin: 'purple',
  doctor: 'info',
  patient: 'success',
} as const

function getBreadcrumb(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (!segments.length) return 'Home'
  const last = segments[segments.length - 1]
  if (/^[0-9a-f-]{8,}$/i.test(last) && segments.length > 1) {
    return segments[segments.length - 2]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function NotificationBell() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()

  const { data: unread } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationsService.unreadCount(),
    refetchInterval: 30_000,
    enabled: !!user?.id,
  })

  const { data: recent } = useQuery({
    queryKey: ['notifications-recent'],
    queryFn: () => notificationsService.list({ limit: 6 }),
    enabled: open && !!user?.id,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-recent'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-recent'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('All marked as read')
    },
  })

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const count = unread?.count ?? 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Notifications"
      >
        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-slate-900/5 z-50">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {count > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {recent?.data.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No notifications</p>
            ) : (
              recent?.data.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 leading-snug">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markReadMutation.mutate(n.id)}
                      className="shrink-0 text-[10px] text-slate-400 hover:text-blue-600 font-medium"
                    >
                      Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2.5">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { toggleSidebar } = useUIStore()

  async function handleLogout() {
    try {
      await authService.logout()
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('hb_auth')
    localStorage.removeItem('hb_access_token')
    localStorage.removeItem('hb_refresh_token')
    sessionStorage.removeItem('hb_access_token')
    sessionStorage.removeItem('hb_refresh_token')
    await clearSession()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
      <button
        onClick={toggleSidebar}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="hidden sm:inline text-slate-400">CliniLynk</span>
        <span className="hidden sm:inline text-slate-300">/</span>
        <span className="truncate font-medium text-slate-700">{getBreadcrumb(pathname)}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Role badge — hidden on very small screens */}
        {user && (
          <span className="hidden sm:block">
            <Badge variant={roleBadgeVariant[user.role]}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </span>
        )}

        <div className="hidden sm:block h-5 w-px bg-slate-200" />

        <NotificationBell />

        <div className="h-5 w-px bg-slate-200" />

        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-50 transition-colors"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{user.email}</p>
            </div>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex h-8 items-center gap-1.5 rounded-md px-2 sm:px-2.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
