'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { Avatar } from '@/components/ui/Avatar'
import { appointmentsService } from '@/services/appointments.service'
import { useAuthStore } from '@/store/auth.store'
import { formatDateTime } from '@/utils/format'
import type { AppointmentStatus, AppointmentType } from '@/types'

const statusVariant: Record<AppointmentStatus, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'error',
  COMPLETED: 'info',
  NO_SHOW: 'default',
}

const typeLabels: Record<AppointmentType, string> = {
  CONSULTATION: 'Consultation',
  FOLLOW_UP: 'Follow-up',
  LAB_REVIEW: 'Lab Review',
  PROCEDURE: 'Procedure',
  EMERGENCY: 'Emergency',
}

export default function AppointmentsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const filters = {
    ...(user?.role === 'patient' ? { patientId: user.id } : {}),
    ...(user?.role === 'doctor' ? { doctorId: user.id } : {}),
    ...(status ? { status: status as AppointmentStatus } : {}),
    page,
    limit: 15,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentsService.list(filters),
    enabled: !!user,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment cancelled')
    },
    onError: () => toast.error('Failed to cancel appointment'),
  })

  const confirmMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.updateStatus(id, 'CONFIRMED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment confirmed')
    },
    onError: () => toast.error('Failed to confirm appointment'),
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.updateStatus(id, 'COMPLETED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Marked as completed')
    },
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Appointments</h1>
          <p className="mt-0.5 text-sm text-slate-500">{data?.total ?? 0} total</p>
        </div>
        {user?.role === 'patient' && (
          <Link href="/appointments/new">
            <Button size="sm">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Book Appointment
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'CONFIRMED', label: 'Confirmed' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'NO_SHOW', label: 'No Show' },
          ]}
          placeholder="All statuses"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="w-44"
        />
      </div>

      <Card padding="none">
        {isLoading ? (
          <div className="p-5"><TableSkeleton rows={8} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {[
                    user?.role !== 'patient' ? 'Patient' : null,
                    user?.role !== 'doctor' ? 'Doctor' : null,
                    'Type',
                    'Date & Time',
                    'Status',
                    '',
                  ].filter(Boolean).map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                    {user?.role !== 'patient' && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={appt.patientName ?? '?'} size="sm" />
                          <span className="font-medium text-slate-900">{appt.patientName ?? '—'}</span>
                        </div>
                      </td>
                    )}
                    {user?.role !== 'doctor' && (
                      <td className="px-4 py-3 text-slate-700">
                        {appt.doctorName ?? '—'}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{appt.title}</p>
                      <p className="text-xs text-slate-500">{typeLabels[appt.type]}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {formatDateTime(appt.scheduledAt)}
                      <p className="text-xs text-slate-400">{appt.duration} min</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[appt.status]}>
                        {appt.status.charAt(0) + appt.status.slice(1).toLowerCase().replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.status === 'PENDING' && user?.role === 'doctor' && (
                          <button
                            onClick={() => confirmMutation.mutate(appt.id)}
                            disabled={confirmMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status === 'CONFIRMED' && user?.role === 'doctor' && (
                          <button
                            onClick={() => completeMutation.mutate(appt.id)}
                            disabled={completeMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                          <button
                            onClick={() => cancelMutation.mutate(appt.id)}
                            disabled={cancelMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.data.length && (
              <div className="flex flex-col items-center py-16 text-slate-500">
                <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">No appointments found</p>
                {user?.role === 'patient' && (
                  <Link href="/appointments/new" className="mt-3">
                    <Button size="sm" variant="outline">Book your first appointment</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center border-t border-slate-200 px-4 py-3">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
