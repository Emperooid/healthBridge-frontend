'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { appointmentsService } from '@/services/appointments.service'
import { useAuthStore } from '@/store/auth.store'
import type { Appointment, AppointmentStatus } from '@/types'

const statusVariant: Record<AppointmentStatus, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'error',
  COMPLETED: 'info',
  NO_SHOW: 'default',
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (monday.getFullYear() !== sunday.getFullYear()) {
    return `${monday.toLocaleDateString('en-US', { ...opts, year: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
  }
  if (monday.getMonth() !== sunday.getMonth()) {
    return `${monday.toLocaleDateString('en-US', opts)} – ${sunday.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
  }
  return `${monday.toLocaleDateString('en-US', opts)} – ${sunday.getDate()}, ${sunday.getFullYear()}`
}

function AppointmentCard({
  appt,
  onConfirm,
  onComplete,
  onCancel,
  loading,
}: {
  appt: Appointment
  onConfirm: (id: string) => void
  onComplete: (id: string) => void
  onCancel: (id: string) => void
  loading: boolean
}) {
  return (
    <div className={`rounded-lg border p-3 text-left transition-colors ${
      appt.status === 'CANCELLED' ? 'border-slate-100 bg-slate-50 opacity-50' :
      appt.status === 'COMPLETED' ? 'border-slate-200 bg-slate-50' :
      appt.status === 'CONFIRMED' ? 'border-blue-200 bg-blue-50/50' :
      'border-amber-200 bg-amber-50/50'
    }`}>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-xs font-semibold text-slate-900">
          {formatTime(appt.scheduledAt)}
        </span>
        <span className="text-[10px] text-slate-400">{appt.duration}m</span>
      </div>
      <p className="text-xs font-medium text-slate-900 truncate">{appt.patientName ?? 'Patient'}</p>
      <p className="text-[11px] text-slate-500 truncate mb-2">{appt.title}</p>
      <Badge variant={statusVariant[appt.status]} className="text-[10px]">
        {appt.status.charAt(0) + appt.status.slice(1).toLowerCase().replace('_', ' ')}
      </Badge>

      {appt.status === 'PENDING' && !loading && (
        <div className="mt-2 flex gap-1.5">
          <button
            onClick={() => onConfirm(appt.id)}
            className="flex-1 rounded px-1.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => onCancel(appt.id)}
            className="rounded px-1.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            Decline
          </button>
        </div>
      )}
      {appt.status === 'CONFIRMED' && !loading && (
        <button
          onClick={() => onComplete(appt.id)}
          className="mt-2 w-full rounded px-1.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          Mark complete
        </button>
      )}
    </div>
  )
}

export default function SchedulePage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOf(new Date()))

  const weekEnd = addDays(weekStart, 6)

  const { data, isLoading } = useQuery({
    queryKey: ['schedule', toDateStr(weekStart), user?.id],
    queryFn: () =>
      appointmentsService.list({
        doctorId: user?.id,
        from: toDateStr(weekStart),
        to: toDateStr(addDays(weekEnd, 1)),
        limit: 200,
      }),
    enabled: !!user?.id,
  })

  const confirmMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.updateStatus(id, 'CONFIRMED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment confirmed')
    },
    onError: () => toast.error('Failed to confirm'),
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.updateStatus(id, 'COMPLETED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Marked as completed')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment cancelled')
    },
    onError: () => toast.error('Failed to cancel'),
  })

  const mutating = confirmMutation.isPending || completeMutation.isPending || cancelMutation.isPending

  // Group appointments by date string
  const byDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    data?.data?.forEach((appt) => {
      const day = toDateStr(new Date(appt.scheduledAt))
      if (!map[day]) map[day] = []
      map[day].push(appt)
      map[day].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    })
    return map
  }, [data])

  const today = toDateStr(new Date())
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const totalThisWeek = data?.total ?? 0
  const pendingCount = data?.data?.filter((a) => a.status === 'PENDING').length ?? 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Schedule</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {totalThisWeek} appointments this week
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-900">{formatWeekRange(weekStart)}</p>
          </div>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(getMondayOf(new Date()))}
            className="hidden sm:flex"
          >
            Today
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <TableSkeleton rows={5} />
        </div>
      ) : (
        <>
          {/* Desktop weekly grid */}
          <div className="hidden md:grid md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dateStr = toDateStr(day)
              const isToday = dateStr === today
              const appts = byDay[dateStr] ?? []

              return (
                <div key={dateStr} className="min-h-[200px]">
                  {/* Day header */}
                  <div className={`mb-2 rounded-lg px-2 py-1.5 text-center ${isToday ? 'bg-blue-600' : 'bg-slate-100'}`}>
                    <p className={`text-[11px] font-semibold uppercase tracking-wide ${isToday ? 'text-blue-200' : 'text-slate-500'}`}>
                      {DAY_NAMES[day.getDay()]}
                    </p>
                    <p className={`text-lg font-bold leading-tight ${isToday ? 'text-white' : 'text-slate-900'}`}>
                      {day.getDate()}
                    </p>
                    {appts.length > 0 && (
                      <p className={`text-[10px] ${isToday ? 'text-blue-200' : 'text-slate-400'}`}>
                        {appts.length} appt{appts.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Appointments */}
                  <div className="space-y-2">
                    {appts.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appt={appt}
                        onConfirm={(id) => confirmMutation.mutate(id)}
                        onComplete={(id) => completeMutation.mutate(id)}
                        onCancel={(id) => cancelMutation.mutate(id)}
                        loading={mutating}
                      />
                    ))}
                    {appts.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-200 px-2 py-4 text-center">
                        <p className="text-[11px] text-slate-300">Free</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile: vertical list grouped by day */}
          <div className="md:hidden space-y-4">
            {weekDays.map((day) => {
              const dateStr = toDateStr(day)
              const isToday = dateStr === today
              const appts = byDay[dateStr] ?? []
              if (appts.length === 0 && !isToday) return null

              return (
                <div key={dateStr}>
                  <div className={`flex items-center gap-2 mb-2 px-1 ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {day.getDate()}
                    </div>
                    <span className="text-sm font-semibold">{DAY_FULL[day.getDay()]}</span>
                    {isToday && <span className="text-xs font-medium text-blue-500">Today</span>}
                    <span className="text-xs text-slate-400 ml-auto">{appts.length} appts</span>
                  </div>
                  {appts.length === 0 ? (
                    <p className="pl-10 text-sm text-slate-400">No appointments</p>
                  ) : (
                    <div className="pl-10 space-y-2">
                      {appts.map((appt) => (
                        <AppointmentCard
                          key={appt.id}
                          appt={appt}
                          onConfirm={(id) => confirmMutation.mutate(id)}
                          onComplete={(id) => completeMutation.mutate(id)}
                          onCancel={(id) => cancelMutation.mutate(id)}
                          loading={mutating}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {Object.keys(byDay).length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
                <svg className="mx-auto mb-3 h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-slate-500">No appointments this week</p>
              </div>
            )}
          </div>

          {/* Desktop empty state */}
          {Object.keys(byDay).length === 0 && (
            <div className="hidden md:flex flex-col items-center rounded-lg border border-slate-200 bg-white py-16 text-center">
              <svg className="mb-3 h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-slate-500">No appointments this week</p>
              <p className="mt-1 text-xs text-slate-400">Patients will book with you through the HealthBridge platform</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
