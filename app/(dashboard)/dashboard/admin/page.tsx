'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { hospitalsService } from '@/services/hospitals.service'
import { usersService } from '@/services/users.service'
import { auditService } from '@/services/audit.service'
import { formatDateTime, capitalise } from '@/utils/format'
import type { AuditAction } from '@/types'

const actionBadge: Partial<Record<AuditAction, 'success' | 'info' | 'warning' | 'error' | 'purple'>> = {
  LOGIN: 'success',
  CREATE: 'success',
  READ: 'info',
  UPDATE: 'warning',
  DELETE: 'error',
  FILE_UPLOAD: 'info',
  FILE_ACCESS: 'info',
  SHARE: 'purple',
}

const quickActions = [
  { href: '/hospitals/new', label: 'Add Hospital', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/hospitals', label: 'Hospitals', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/patients', label: 'Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/audit-logs', label: 'Audit Logs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { href: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

function OnboardingBanner({ doctorCount }: { doctorCount: number }) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem('hb_onboarding_dismissed') === 'true')
  }, [])

  if (dismissed || doctorCount > 0) return null

  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Welcome to CliniLynk! Let&apos;s set up your hospital</p>
            <p className="text-xs text-slate-500 mt-0.5">Complete these steps to get your team up and running</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('hb_onboarding_dismissed', 'true')
            setDismissed(true)
          }}
          className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-blue-100 hover:text-slate-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            step: 1,
            done: true,
            title: 'Hospital registered',
            desc: 'Your hospital account is active on CliniLynk',
            action: null,
          },
          {
            step: 2,
            done: false,
            title: 'Invite your first doctor',
            desc: 'Go to Users → Invite Doctor to add your medical team',
            action: { href: '/users', label: 'Invite Doctor →' },
          },
          {
            step: 3,
            done: false,
            title: 'Patients can now register',
            desc: 'Patients select your hospital when they create an account',
            action: null,
          },
        ].map(({ step, done, title, desc, action }) => (
          <div key={step} className={`rounded-lg border p-3.5 ${done ? 'border-green-200 bg-white' : 'border-blue-100 bg-white'}`}>
            <div className="flex items-center gap-2 mb-2">
              {done ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                  {step}
                </div>
              )}
              <p className={`text-xs font-semibold ${done ? 'text-green-800' : 'text-slate-900'}`}>{title}</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            {action && (
              <Link href={action.href} className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-700">
                {action.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: hospitals } = useQuery({
    queryKey: ['hospitals-count'],
    queryFn: () => hospitalsService.list({ limit: 1 }),
  })

  const { data: doctors } = useQuery({
    queryKey: ['doctors-count'],
    queryFn: () => usersService.list({ role: 'DOCTOR', limit: 1 }),
  })

  const { data: patients } = useQuery({
    queryKey: ['patients-count'],
    queryFn: () => usersService.list({ role: 'PATIENT', limit: 1 }),
  })

  const { data: recentLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => auditService.list({ limit: 6 }),
  })

  return (
    <div className="space-y-6">
      <OnboardingBanner doctorCount={doctors?.total ?? 1} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">Platform overview</p>
        </div>
        <Link href="/hospitals/new">
          <Button size="sm">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Hospital
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          title="Hospitals"
          value={hospitals?.total ?? '—'}
          accentColor="bg-blue-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="Doctors"
          value={doctors?.total ?? '—'}
          accentColor="bg-violet-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Patients"
          value={patients?.total ?? '—'}
          accentColor="bg-emerald-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Recent Activity</h2>
              <Link href="/audit-logs" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View all →
              </Link>
            </div>
            {loadingLogs ? (
              <div className="p-5"><TableSkeleton rows={5} /></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentLogs?.data.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{log.userName}</p>
                        <Badge variant={actionBadge[log.action] ?? 'default'}>
                          {capitalise(log.action.replace(/_/g, ' ').toLowerCase())}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{log.resourceType}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{formatDateTime(log.timestamp)}</span>
                  </div>
                ))}
                {!recentLogs?.data.length && (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">No recent activity.</p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <Card padding="none">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 transition-colors group">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                    <svg className="ml-auto h-4 w-4 text-slate-300 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
