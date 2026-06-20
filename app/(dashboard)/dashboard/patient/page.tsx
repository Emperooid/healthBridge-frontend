'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { recordsService } from '@/services/records.service'
import { appointmentsService } from '@/services/appointments.service'
import { patientsService } from '@/services/patients.service'
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

export default function PatientDashboard() {
  const { user } = useAuthStore()

  const { data: records, isLoading } = useQuery({
    queryKey: ['my-records'],
    queryFn: () => recordsService.mine(),
    enabled: !!user?.id,
  })

  const { data: profile } = useQuery({
    queryKey: ['patient-me'],
    queryFn: () => patientsService.me(),
    enabled: !!user?.id,
  })

  const { data: appointments, isLoading: loadingAppts } = useQuery({
    queryKey: ['my-appointments', user?.id],
    queryFn: () => appointmentsService.list({ patientId: user!.id, limit: 4 }),
    enabled: !!user?.id,
  })

  const activeRecords = records?.data?.filter((r) => r.status === 'ACTIVE') ?? []
  const totalAttachments = records?.data?.reduce((acc, r) => acc + (r.attachments?.length ?? 0), 0) ?? 0
  const upcomingAppts = appointments?.data.filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING') ?? []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Health</h1>
        <p className="mt-0.5 text-sm text-slate-500">Welcome back, {user?.firstName ?? user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Records"
          value={records?.total ?? records?.data?.length ?? 0}
          accentColor="bg-blue-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Active Records"
          value={activeRecords.length}
          accentColor="bg-emerald-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Attachments"
          value={totalAttachments}
          accentColor="bg-violet-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          }
        />
      </div>

      {/* Health Summary */}
      {profile && (profile.bloodType || (profile.allergies && profile.allergies.length > 0)) && (
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-3">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Health Summary</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {profile.bloodType && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Blood Type</p>
                <span className="mt-1 inline-flex items-center rounded-md bg-red-50 border border-red-100 px-2.5 py-0.5 text-sm font-bold text-red-700">
                  {profile.bloodType}
                </span>
              </div>
            )}
            {profile.allergies && profile.allergies.length > 0 && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Allergies</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {profile.allergies.map((allergy) => (
                    <span key={allergy} className="inline-flex items-center rounded-md bg-amber-50 border border-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Upcoming Appointments</h2>
          <Link href="/appointments" className="text-xs font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        {loadingAppts ? (
          <div className="p-5"><TableSkeleton rows={2} /></div>
        ) : upcomingAppts.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-slate-500">
            <p className="text-sm">No upcoming appointments</p>
            <Link href="/appointments/new" className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
              Book one →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingAppts.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate">{appt.title}</p>
                    <Badge variant={apptStatusVariant[appt.status]}>{appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {appt.doctorName ? `Dr. ${appt.doctorName}` : ''}{appt.doctorName && appt.hospitalName ? ' · ' : ''}{appt.hospitalName ?? ''}
                  </p>
                  <p className="text-xs text-slate-400">{formatDateTime(appt.scheduledAt)} · {appt.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Medical history */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Medical History</h2>
              <Link
                href={`/patients/${user?.id}/records`}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>

            {isLoading ? (
              <div className="p-5"><TableSkeleton rows={4} /></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {records?.data?.slice(0, 6).map((record) => (
                  <div key={record.id} className="flex items-start gap-4 px-5 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">{record.title}</p>
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
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{record.description}</p>
                      {record.diagnosis && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        {record.doctorName && <span>Dr. {record.doctorName} · </span>}
                        {formatDate(record.visitDate ?? record.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {!records?.data?.length && (
                  <p className="py-12 text-center text-sm text-slate-500">No medical records yet.</p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card padding="none">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                { href: `/patients/${user?.id}/records`, label: 'My Records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { href: '/appointments/new', label: 'Book Appointment', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { href: '/share', label: 'Share Records', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
                { href: '/profile', label: 'Edit Profile', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-slate-50 transition-colors group">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
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

          {records && records.data.length > 0 && (
            <Card padding="sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Last Updated</p>
              <p className="text-sm font-medium text-slate-900">
                {formatDate(records.data[0].visitDate ?? records.data[0].createdAt)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{records.data[0].title}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
