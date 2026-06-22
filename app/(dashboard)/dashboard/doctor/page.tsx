'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { patientsService } from '@/services/patients.service'
import { recordsService } from '@/services/records.service'
import { appointmentsService } from '@/services/appointments.service'
import { useAuthStore } from '@/store/auth.store'
import { formatDate, formatDateTime } from '@/utils/format'
import type { AppointmentStatus } from '@/types'

const apptStatusVariant: Record<AppointmentStatus, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'error',
  COMPLETED: 'info',
  NO_SHOW: 'default',
}

export default function DoctorDashboard() {
  const { user } = useAuthStore()

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['my-patients', user?.id],
    queryFn: () => patientsService.list({ doctorId: user?.id, limit: 8 }),
    enabled: !!user?.id,
  })

  const { data: recentRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['doctor-recent-records', user?.id],
    queryFn: () => recordsService.list({ limit: 5 }),
    enabled: !!user?.id,
  })

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const tomorrowStr = new Date(today.getTime() + 86_400_000).toISOString().split('T')[0]

  const { data: todayAppts, isLoading: loadingAppts } = useQuery({
    queryKey: ['doctor-today-appts', user?.id],
    queryFn: () => appointmentsService.list({
      from: todayStr,
      to: tomorrowStr,
      limit: 10,
    }),
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Welcome, Dr. {user?.firstName ?? user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Here&apos;s an overview of your practice</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Patients"
          value={patientsData?.total ?? '—'}
          accentColor="bg-blue-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Recent Records"
          value={recentRecords?.total ?? '—'}
          accentColor="bg-emerald-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppts?.total ?? '—'}
          accentColor="bg-amber-500"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Today's Schedule */}
      {(todayAppts?.data.length ?? 0) > 0 && (
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Today&apos;s Schedule</h2>
            <Link href="/appointments" className="text-xs font-medium text-blue-600 hover:text-blue-700">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {todayAppts?.data.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-16 shrink-0 text-right">
                  <p className="text-xs font-semibold text-slate-700">
                    {new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-slate-400">{appt.duration}m</p>
                </div>
                <div className="flex h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-900">{appt.patientName}</p>
                    <Badge variant={apptStatusVariant[appt.status]}>{appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{appt.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Patient list */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">My Patients</h2>
              <Link href="/patients" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View all →
              </Link>
            </div>
            {isLoading ? (
              <div className="p-5"><TableSkeleton rows={5} /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Blood Type</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Last Visit</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientsData?.data.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={patient.name} size="sm" />
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate">{patient.name}</p>
                              <p className="text-xs text-slate-500 truncate">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {patient.bloodType ? (
                            <Badge variant="info">{patient.bloodType}</Badge>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {patient.lastVisit ? formatDate(patient.lastVisit) : '—'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!patientsData?.data.length && (
                  <p className="py-12 text-center text-sm text-slate-500">No patients assigned yet.</p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Recent records */}
        <div>
          <Card padding="none">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Recent Records</h2>
            </div>
            {loadingRecords ? (
              <div className="p-4"><TableSkeleton rows={4} /></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentRecords?.data.map((record) => (
                  <div key={record.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{record.title}</p>
                      <Badge
                        variant={
                          record.status === 'ACTIVE' ? 'success'
                          : record.status === 'DRAFT' ? 'warning'
                          : 'default'
                        }
                      >
                        {record.status ?? 'Active'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{record.description}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(record.visitDate ?? record.createdAt)}</p>
                  </div>
                ))}
                {!recentRecords?.data.length && (
                  <p className="py-8 text-center text-sm text-slate-500">No records yet.</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
