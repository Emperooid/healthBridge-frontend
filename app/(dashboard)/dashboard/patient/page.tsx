'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { MedicalTimeline } from '@/features/patients/components/MedicalTimeline'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { recordsService } from '@/services/records.service'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/format'

export default function PatientDashboard() {
  const { user } = useAuthStore()

  const { data: records, isLoading } = useQuery({
    queryKey: ['my-records', user?.id],
    queryFn: () => recordsService.getByPatient(user!.id),
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Health</h1>
        <p className="text-sm text-slate-500">Welcome, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Records"
          value={records?.length ?? 0}
          iconBg="bg-blue-100"
          icon={<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard
          title="Attachments"
          value={records?.reduce((acc, r) => acc + r.attachments.length, 0) ?? 0}
          iconBg="bg-green-100"
          icon={<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
        />
        <StatCard
          title="Last Updated"
          value={records?.length ? formatDate(records[0].date) : 'N/A'}
          iconBg="bg-purple-100"
          icon={<svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <Link href={`/patients/${user?.id}/records`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </Link>
            </CardHeader>
            {isLoading ? (
              <TableSkeleton rows={3} />
            ) : (
              <MedicalTimeline records={records?.slice(0, 5) ?? []} />
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card padding="sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <Link href={`/patients/${user?.id}`}>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">View Profile</span>
                </div>
              </Link>
              <Link href={`/patients/${user?.id}/records`}>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Upload Document</span>
                </div>
              </Link>
            </div>
          </Card>

          <Card padding="sm">
            <CardHeader>
              <CardTitle>Data Access</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Cross-hospital access</span>
                <Badge variant="success">Enabled</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Your records can be accessed by authorized hospitals you&apos;ve visited.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
