'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { notificationsService } from '@/services/notifications.service'
import { formatDateTime } from '@/utils/format'
import type { NotificationType } from '@/types'

const typeVariant: Record<NotificationType, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
  appointment_confirmed: 'success',
  appointment_cancelled: 'error',
  appointment_reminder: 'warning',
  record_shared: 'info',
  record_updated: 'info',
  lab_result: 'purple' as 'info',
  prescription: 'info',
  system: 'default',
}

const typeIcon: Record<NotificationType, string> = {
  appointment_confirmed: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  appointment_cancelled: 'M6 18L18 6M6 6l12 12',
  appointment_reminder: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  record_shared: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
  record_updated: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  lab_result: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  prescription: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.list({ limit: 50 }),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })
      toast.success('All notifications marked as read')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: () => toast.error('Failed to delete notification'),
  })

  const unreadCount = data?.data.filter((n) => !n.read).length ?? 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-0.5 text-sm text-slate-500">{data?.total ?? 0} total · {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-5"><TableSkeleton rows={8} /></div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm font-medium">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.data.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${!notification.read ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${!notification.read ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  <svg className={`h-4 w-4 ${!notification.read ? 'text-blue-600' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={typeIcon[notification.type] ?? typeIcon.system} />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{formatDateTime(notification.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{notification.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        View →
                      </Link>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => markReadMutation.mutate(notification.id)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(notification.id)}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
