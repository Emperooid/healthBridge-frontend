'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { TableSkeleton } from '@/components/ui/Skeleton'

function BarChart({ data, color = 'bg-blue-500' }: { data: { label: string; value: number }[]; color?: string }) {
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">No data</p>
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1 min-w-0">
          <span className="text-[10px] font-medium text-slate-600">{d.value}</span>
          <div
            className={`w-full rounded-t ${color} transition-all`}
            style={{ height: `${Math.max((d.value / max) * 96, d.value > 0 ? 4 : 0)}px` }}
          />
          <span className="text-[9px] text-slate-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function TimeSeriesChart({ data, color = 'bg-blue-500' }: { data: { date: string; count: number }[]; color?: string }) {
  const chartData = data.map((d) => ({
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: d.count,
  }))
  return <BarChart data={chartData} color={color} />
}

export default function AnalyticsPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsService.overview(),
  })

  const { data: patientsSeries } = useQuery({
    queryKey: ['analytics-patients'],
    queryFn: () => analyticsService.patients(),
  })

  const { data: appointmentsSeries } = useQuery({
    queryKey: ['analytics-appointments'],
    queryFn: () => analyticsService.appointments(),
  })

  const { data: labsSeries } = useQuery({
    queryKey: ['analytics-labs'],
    queryFn: () => analyticsService.labs(),
  })

  const { data: prescriptionsSeries } = useQuery({
    queryKey: ['analytics-prescriptions'],
    queryFn: () => analyticsService.prescriptions(),
  })

  const { data: hospitalsSeries } = useQuery({
    queryKey: ['analytics-hospitals'],
    queryFn: () => analyticsService.hospitals(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-0.5 text-sm text-slate-500">Platform-wide metrics and trends</p>
      </div>

      {/* Overview stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Total Patients"
            value={overview?.totalPatients ?? 0}
            accentColor="bg-blue-600"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            title="Appointments"
            value={overview?.totalAppointments ?? 0}
            accentColor="bg-emerald-600"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Lab Orders"
            value={overview?.totalLabOrders ?? 0}
            accentColor="bg-violet-600"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          <StatCard
            title="Prescriptions"
            value={overview?.totalPrescriptions ?? 0}
            accentColor="bg-amber-500"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
        </div>
      )}

      {/* Secondary stats */}
      {overview && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hospitals</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">{overview.totalHospitals}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Doctors</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">{overview.totalDoctors}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medical Records</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">{overview.totalRecords}</p>
          </div>
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card padding="none">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">New Patients</h2>
          </div>
          <div className="p-5">
            {patientsSeries ? (
              <TimeSeriesChart data={patientsSeries.slice(-12)} color="bg-blue-500" />
            ) : (
              <TableSkeleton rows={3} />
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Appointments</h2>
          </div>
          <div className="p-5">
            {appointmentsSeries ? (
              <TimeSeriesChart data={appointmentsSeries.slice(-12)} color="bg-emerald-500" />
            ) : (
              <TableSkeleton rows={3} />
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Lab Orders</h2>
          </div>
          <div className="p-5">
            {labsSeries ? (
              <TimeSeriesChart data={labsSeries.slice(-12)} color="bg-violet-500" />
            ) : (
              <TableSkeleton rows={3} />
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Prescriptions</h2>
          </div>
          <div className="p-5">
            {prescriptionsSeries ? (
              <TimeSeriesChart data={prescriptionsSeries.slice(-12)} color="bg-amber-500" />
            ) : (
              <TableSkeleton rows={3} />
            )}
          </div>
        </Card>
      </div>

      {/* Hospitals bar chart */}
      {hospitalsSeries && hospitalsSeries.length > 0 && (
        <Card padding="none">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Patients by Hospital</h2>
          </div>
          <div className="p-5">
            <BarChart
              data={hospitalsSeries.map((h) => ({ label: h.label, value: h.value }))}
              color="bg-blue-500"
            />
          </div>
        </Card>
      )}
    </div>
  )
}
